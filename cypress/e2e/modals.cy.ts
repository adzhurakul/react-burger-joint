const repeatedSelector = '[data-cy="dragableIngredients-643d69a5c3f7b9001cfa0941"]';
const ingredientsSelectors = Array(7).fill(repeatedSelector);

const modalFields = ['Калории,kcal', 'Белки,g', 'Жиры,g', 'Углеводы,g'];

const checkIngredientModal = (selector: string): void => {
  cy.get(selector).first().click();

  cy.get('[data-cy="modalContainer"]')
    .should('exist')
    .within(() => {
      cy.contains('Детали ингредиента');
      modalFields.forEach((field) => {
        cy.contains(field);
      });
    });

  cy.get('[data-cy="modalCloseIcon"]').click();
  cy.get('[data-cy="modalContainer"]').should('not.exist');
};

describe('Ingredient modal tests', () => {
  before(() => {
    cy.viewport(1920, 1024);
    cy.visit('http://localhost:3001/');
  });

  it('should open and close ingredient modals correctly', () => {
    ingredientsSelectors.forEach(checkIngredientModal);
  });
});
