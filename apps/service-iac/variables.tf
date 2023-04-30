# variables.tf

variable "database_url" {
  description = "The DATABASE_URL secret for the app"
  type        = string
}

variable "direct_url" {
  description = "The DIRECT_URL secret for the app"
  type        = string
}
