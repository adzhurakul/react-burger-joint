const selector = '[data-cy="dragableIngredients-643d69a5c3f7b9001cfa0941"]';
const modalFields = ['Калории,kcal', 'Белки,g', 'Жиры,g', 'Углеводы,g'];

const checkIngredientModal = (selector: string): void => {
  cy.get(selector).first().click();

  cy.get('[data-cy="modalContainer"]')
    .should('be.visible')
    .within(() => {
      cy.contains('Детали ингредиента').should('exist');
      modalFields.forEach((field) => {
        cy.contains(field).should('exist');
      });
    });

  cy.get('[data-cy="modalCloseIcon"]').should('be.visible').click();
  cy.get('[data-cy="modalContainer"]').should('not.exist');
};

describe('Ingredient modal tests', () => {
  before(() => {
    cy.viewport(1920, 1024);
    cy.visit('/');
  });

  it('should open and close ingredient modals correctly', () => {
    checkIngredientModal(selector);
  });
});
