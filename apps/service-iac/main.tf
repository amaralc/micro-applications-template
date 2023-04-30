# main.tf
terraform {
  required_providers {
    fly = {
      source  = "fly-apps/fly"
      version = "0.0.20"
    }
  }
}

provider "fly" {
  useinternaltunnel    = true
  internaltunnelorg    = "personal"
  internaltunnelregion = "gru"
}

locals {
  app_name         = "micro-applications-template-rest-api"
  commit_hash_file = "${path.module}/.commit_hash"
}

resource "null_resource" "get_commit_hash" {
  provisioner "local-exec" {
    command = "git rev-parse --short HEAD > ${local.commit_hash_file}"
  }
}

data "local_file" "commit_hash" {
  filename   = local.commit_hash_file
  depends_on = [null_resource.get_commit_hash]
}

locals {
  image_tag = trimspace(data.local_file.commit_hash.content)
}

resource "null_resource" "build_and_push_docker_image" {
  triggers = {
    dockerfile_content = filesha256("${path.module}/../service-rest-api/Dockerfile")
  }

  provisioner "local-exec" {
    command = <<EOF
      cd ../../ &&
      flyctl auth docker &&
      docker build --build-arg DATABASE_URL=${var.database_url} \
      --build-arg DIRECT_URL=${var.direct_url} \
      -t registry.fly.io/${local.app_name}:${local.image_tag} -f apps/service-rest-api/Dockerfile . &&
      docker push registry.fly.io/${local.app_name}:${local.image_tag}
    EOF
  }
}



resource "fly_app" "micro-applications-template-rest-api" {
  name = local.app_name
  org  = "personal"
}

resource "null_resource" "set_fly_secrets" {
  provisioner "local-exec" {
    command = <<EOF
      echo "Settings fly secrets..." &&
      cd ../service-rest-api/ &&
      fly secrets set DATABASE_URL=${var.database_url} && fly secrets set DIRECT_URL=${var.direct_url}
    EOF
  }
  depends_on = [fly_app.micro-applications-template-rest-api]
}


resource "fly_ip" "ip_v4" {
  app        = local.app_name
  type       = "v4"
  depends_on = [fly_app.micro-applications-template-rest-api]
}

resource "fly_ip" "ip_v6" {
  app        = local.app_name
  type       = "v6"
  depends_on = [fly_app.micro-applications-template-rest-api]
}

resource "fly_machine" "application_machine" {
  for_each = toset(["gru"])
  app      = local.app_name
  region   = each.value
  name     = "${local.app_name}-${each.value}"
  image    = "registry.fly.io/${local.app_name}:${local.image_tag}"
  services = [
    {
      ports = [
        {
          port     = 443
          handlers = ["tls", "http"]
        },
        {
          port     = 80
          handlers = ["http"]
        }
      ]
      "protocol" : "tcp",
      "internal_port" : 80
    },
  ]
  cpus       = 1
  memorymb   = 256
  depends_on = [fly_app.micro-applications-template-rest-api, null_resource.build_and_push_docker_image]
}
