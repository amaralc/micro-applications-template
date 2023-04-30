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

resource "fly_app" "micro-applications-template-rest-api" {
  name = "micro-applications-template-rest-api" #Replace this with your own app name
  org  = "personal"
}

resource "fly_ip" "ip_v4" {
  app        = "micro-applications-template-rest-api" #Replace this with your own app name
  type       = "v4"
  depends_on = [fly_app.micro-applications-template-rest-api]
}

resource "fly_ip" "ip_v6" {
  app        = "micro-applications-template-rest-api" #Replace this with your own app name
  type       = "v6"
  depends_on = [fly_app.micro-applications-template-rest-api]
}


resource "fly_machine" "application_machine" {
  for_each = toset(["gru"])
  app      = "micro-applications-template-rest-api" #Replace this with your own app name
  region   = each.value
  name     = "micro-applications-template-rest-api-${each.value}"
  image    = "flyio/iac-tutorial:latest"
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
  depends_on = [fly_app.micro-applications-template-rest-api]
}
