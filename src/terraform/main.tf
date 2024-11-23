locals {
  tags = {
    Environment = var.environment
    Owner       = var.owner
    Project     = var.project
  }
}

resource "random_string" "random_string" {
  length  = 4
  upper   = false
  special = false
}

resource "azurerm_resource_group" "rg" {
  location = var.location
  name     = "rg-${var.application}-${random_string.random_string.result}"
  tags     = local.tags
}
