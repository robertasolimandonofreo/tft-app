describe('Navigation', () => {
    it('should navigate between pages', () => {
      // Start at home
      cy.visit('/')
      cy.get('[data-cy="home-page"]').should('be.visible')
      
      // Go to leagues
      cy.get('[data-cy="leagues-link"]').click()
      cy.get('[data-cy="leagues-page"]').should('be.visible')
      
      // Go back home
      cy.get('[data-cy="back-home-link"]').click()
      cy.get('[data-cy="home-page"]').should('be.visible')
    })
  
    it('should handle direct URL access', () => {
      cy.visit('/leagues')
      cy.get('[data-cy="leagues-page"]').should('be.visible')
      
      cy.visit('/')
      cy.get('[data-cy="home-page"]').should('be.visible')
    })
  })
  