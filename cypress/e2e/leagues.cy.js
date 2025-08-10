describe('Leagues Page', () => {
    beforeEach(() => {
      cy.visit('/leagues')
    })
  
    it('should display leagues page elements', () => {
      cy.get('[data-cy="leagues-page"]').should('be.visible')
      cy.get('[data-cy="leagues-title"]').should('contain', 'TOP 10 High Tier Leagues')
      cy.get('[data-cy="back-home-link"]').should('be.visible')
    })
  
    it('should show loading state', () => {
      cy.intercept('GET', '**/league/challenger', { delay: 2000, fixture: 'challenger.json' })
      cy.intercept('GET', '**/league/grandmaster', { delay: 2000, fixture: 'grandmaster.json' })
      cy.intercept('GET', '**/league/master', { delay: 2000, fixture: 'master.json' })
      
      cy.visit('/leagues')
      cy.get('[data-cy="leagues-loading"]').should('be.visible')
      cy.get('[data-cy="loading-spinner"]').should('be.visible')
      cy.get('[data-cy="loading-text"]').should('contain', 'Carregando rankings...')
    })
  
    it('should display stats cards', () => {
      cy.get('[data-cy="stats-cards"]').should('be.visible')
      cy.get('[data-cy="stats-total"]').should('be.visible')
      cy.get('[data-cy="stats-challenger"]').should('be.visible')
      cy.get('[data-cy="stats-grandmaster"]').should('be.visible')
      cy.get('[data-cy="stats-master"]').should('be.visible')
    })
  
    it('should filter by tier', () => {
      cy.get('[data-cy="filter-challenger"]').click()
      cy.get('[data-cy="filter-challenger"]').should('have.class', 'bg-blue-600')
      
      cy.get('[data-cy="filter-grandmaster"]').click()
      cy.get('[data-cy="filter-grandmaster"]').should('have.class', 'bg-blue-600')
      
      cy.get('[data-cy="filter-all"]').click()
      cy.get('[data-cy="filter-all"]').should('have.class', 'bg-blue-600')
    })
  
    it('should search for players', () => {
      cy.get('[data-cy="search-player-input"]').type('TestPlayer')
      cy.get('[data-cy="rankings-table-body"]').should('be.visible')
    })
  
    it('should display rankings table', () => {
      cy.get('[data-cy="rankings-table"]').should('be.visible')
      cy.get('[data-cy="rankings-table-title"]').should('contain', 'TOP')
      cy.get('[data-cy="rankings-table-content"]').should('be.visible')
      
      // Check table headers
      cy.get('[data-cy="header-rank"]').should('contain', 'Rank')
      cy.get('[data-cy="header-player"]').should('contain', 'Jogador')
      cy.get('[data-cy="header-tier"]').should('contain', 'Tier')
      cy.get('[data-cy="header-lp"]').should('contain', 'LP')
      cy.get('[data-cy="header-wl"]').should('contain', 'W/L')
      cy.get('[data-cy="header-wr"]').should('contain', 'WR%')
    })
  
    it('should display player rows', () => {
      cy.get('[data-cy="rankings-table-body"]').within(() => {
        cy.get('[data-cy="player-row-0"]').should('be.visible')
        cy.get('[data-cy="player-position-0"]').should('contain', '#1')
        cy.get('[data-cy="player-name-0"]').should('be.visible')
        cy.get('[data-cy="player-tier-0"]').should('be.visible')
        cy.get('[data-cy="player-lp-0"]').should('be.visible')
        cy.get('[data-cy="player-wl-0"]').should('be.visible')
        cy.get('[data-cy="player-winrate-0"]').should('contain', '%')
      })
    })
  
    it('should navigate back to home', () => {
      cy.get('[data-cy="back-home-link"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  
    it('should handle API errors', () => {
      cy.intercept('GET', '**/league/challenger', { statusCode: 500 })
      cy.intercept('GET', '**/league/grandmaster', { statusCode: 500 })
      cy.intercept('GET', '**/league/master', { statusCode: 500 })
      
      cy.visit('/leagues')
      cy.get('[data-cy="leagues-error"]').should('be.visible')
      cy.get('[data-cy="error-title"]').should('contain', 'Erro ao carregar')
      cy.get('[data-cy="error-message"]').should('contain', 'Não foi possível carregar os rankings')
    })
  
    it('should show results summary', () => {
      cy.get('[data-cy="results-summary"]').should('be.visible')
      cy.get('[data-cy="results-summary"]').should('contain', 'Exibindo TOP')
    })
  
    it('should filter and search combined', () => {
      cy.get('[data-cy="filter-challenger"]').click()
      cy.get('[data-cy="search-player-input"]').type('Challenger')
      
      cy.get('[data-cy="rankings-table-body"]').should('be.visible')
      cy.get('[data-cy="results-summary"]').should('be.visible')
    })
  })
  