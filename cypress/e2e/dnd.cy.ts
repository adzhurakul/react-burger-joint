describe('template spec', () => {
  before(() => {
    cy.viewport(1920, 1024);
    cy.visit('http://localhost:3001/');
  });

  it('should drag & drop', () => {
    const constructor = '[data-cy="burgerConstructorContainer"]';

    const ingredients = {
      bun: '[data-cy="dragableIngredients-643d69a5c3f7b9001cfa093c"]',
      fillings: Array(7).fill(
        '[data-cy="dragableIngredients-643d69a5c3f7b9001cfa093e"]'
      ),
    };

    const dragToConstructor = (selector: string): void => {
      cy.get(selector).first().trigger('dragstart');
      cy.get(constructor).trigger('drop');
    };

    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });

    dragToConstructor(ingredients.bun);

    ingredients.fillings.forEach((selector: string) => {
      dragToConstructor(selector);
    });
  });
});
