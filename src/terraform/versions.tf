terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.10.0"
    }
  }
  backend "azurerm" {}

}

provider "azurerm" {
  features {}
  subscription_id = "06b0d563-0c32-4c65-af49-5e6beba81232"

}
