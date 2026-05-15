@products @smoke
Feature: Product management
  Scenario: Create, update, and delete a product
    Given I am on the products page
    When I create a unique product
    Then I should see the product in inventory
    When I update that product
    Then I should see the updated product in inventory
    When I delete that product
    Then the product should be removed from inventory
