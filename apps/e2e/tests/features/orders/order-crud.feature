@orders @smoke
Feature: Order management
  Scenario: Create and cancel an order
    Given I have a product available for ordering
    When I create an order for that product
    Then I should see the new order total
    When I cancel the latest order
    Then the latest order should be cancelled
