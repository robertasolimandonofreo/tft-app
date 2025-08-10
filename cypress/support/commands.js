/// <reference types="cypress" />
Cypress.Commands.add('searchPlayer', (gameName, tagLine = 'BR1') => {
    cy.get('[data-cy="search-input-gamename"]').clear().type(gameName)
    cy.get('[data-cy="search-input-tagline"]').clear().type(tagLine)
    cy.get('[data-cy="search-button"]').click()
  })
  
  Cypress.Commands.add('waitForApiStatus', () => {
    cy.get('[data-cy="api-status"]').should('be.visible')
    cy.get('[data-cy="api-status-online"], [data-cy="api-status-offline"]').should('exist')
  })
  
  Cypress.Commands.add('mockSuccessfulPlayerSearch', () => {
    cy.intercept('GET', '**/search/player*', {
      statusCode: 200,
      body: {
        data: {
          puuid: 'test-puuid',
          gameName: 'TestPlayer',
          tagLine: 'BR1',
          league: {
            tier: 'CHALLENGER',
            rank: 'I',
            leaguePoints: 1000,
            wins: 50,
            losses: 10
          }
        }
      }
    }).as('searchPlayerSuccess')
  })
  
  Cypress.Commands.add('mockFailedPlayerSearch', () => {
    cy.intercept('GET', '**/search/player*', {
      statusCode: 404,
      body: { error: 'Player not found' }
    }).as('searchPlayerFailed')
  })
  
  Cypress.Commands.add('mockLeagueData', () => {
    cy.intercept('GET', '**/league/challenger', {
      fixture: 'challenger.json'
    }).as('challengerData')
  
    cy.intercept('GET', '**/league/grandmaster', {
      fixture: 'grandmaster.json'
    }).as('grandmasterData')
  
    cy.intercept('GET', '**/league/master', {
      fixture: 'master.json'
    }).as('masterData')
  })
