describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the main page elements', () => {
    cy.get('[data-cy="home-page"]').should('be.visible')
    cy.get('[data-cy="main-title"]').should('contain', 'TFT Stats Brasil')
    cy.get('[data-cy="main-description"]').should('be.visible')
    cy.get('[data-cy="api-status"]').should('be.visible')
  })

  it('should show API status', () => {
    cy.get('[data-cy="api-status"]').within(() => {
      cy.get('[data-cy="api-status-online"], [data-cy="api-status-offline"]').should('exist')
    })
  })

  it('should navigate to leagues page', () => {
    cy.get('[data-cy="leagues-link"]').click()
    cy.url().should('include', '/leagues')
  })

  it('should search for a player successfully', () => {
    cy.intercept('GET', '**/search/player*', {
      fixture: 'player-search-success.json'
    }).as('searchPlayer')

    cy.get('[data-cy="search-input-gamename"]').type('TestPlayer')
    cy.get('[data-cy="search-input-tagline"]').clear().type('BR1')
    cy.get('[data-cy="search-button"]').click()
    
    cy.wait('@searchPlayer')
    
    cy.get('[data-cy="search-button"]').should('not.contain', 'Buscando...')
    cy.get('[data-cy="search-result"]').should('be.visible')
  })

  it('should handle search error', () => {
    cy.intercept('GET', '**/search/player*', {
      statusCode: 404,
      body: { error: 'Player not found' }
    }).as('searchPlayerError')

    cy.get('[data-cy="search-input-gamename"]').type('NonExistentPlayer')
    cy.get('[data-cy="search-button"]').click()
    
    cy.wait('@searchPlayerError')
    
    cy.get('[data-cy="search-error"]').should('be.visible')
    cy.get('[data-cy="search-error-message"]').should('contain', 'Jogador não encontrado')
    
    cy.get('[data-cy="search-error-retry"]').click()
    cy.get('[data-cy="search-input-gamename"]').should('have.value', '')
  })

  it('should display search results', () => {
    cy.intercept('GET', '**/search/player*', {
      fixture: 'player-search-success.json'
    }).as('searchPlayer')

    cy.get('[data-cy="search-input-gamename"]').type('TestPlayer')
    cy.get('[data-cy="search-button"]').click()
    
    cy.wait('@searchPlayer')
    
    cy.get('[data-cy="search-result"]').should('be.visible')
    cy.get('[data-cy="search-result-title"]').should('contain', 'TestPlayer#BR1')
    cy.get('[data-cy="search-result-league"]').should('be.visible')
    cy.get('[data-cy="search-result-tier"]').should('be.visible')
    cy.get('[data-cy="search-result-lp"]').should('be.visible')
    cy.get('[data-cy="search-result-wins"]').should('be.visible')
    cy.get('[data-cy="search-result-losses"]').should('be.visible')
    cy.get('[data-cy="search-result-winrate"]').should('be.visible')
  })

  it('should handle player without rank', () => {
    cy.intercept('GET', '**/search/player*', {
      fixture: 'player-search-no-rank.json'
    }).as('searchPlayerNoRank')

    cy.get('[data-cy="search-input-gamename"]').type('UnrankedPlayer')
    cy.get('[data-cy="search-button"]').click()
    
    cy.wait('@searchPlayerNoRank')
    
    cy.get('[data-cy="search-result"]').should('be.visible')
    cy.get('[data-cy="search-result-no-rank"]').should('contain', 'Sem dados de rank disponíveis')
  })

  it('should disable search button when input is too short', () => {
    cy.get('[data-cy="search-input-gamename"]').type('A')
    cy.get('[data-cy="search-button"]').should('be.disabled')
    
    cy.get('[data-cy="search-input-gamename"]').type('B')
    cy.get('[data-cy="search-button"]').should('not.be.disabled')
  })

  it('should allow search with Enter key', () => {
    cy.intercept('GET', '**/search/player*', {
      fixture: 'player-search-success.json'
    }).as('searchPlayer')

    cy.get('[data-cy="search-input-gamename"]').type('TestPlayer{enter}')
    
    cy.wait('@searchPlayer')
    cy.get('[data-cy="search-result"]').should('be.visible')
  })
})