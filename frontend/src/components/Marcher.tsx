import { useState } from 'react'
import './Marcher.css'

interface MarcherProps {
  userData: any
}

export function Marcher({ userData }: MarcherProps) {
  const [activeTab, setActiveTab] = useState('tracking')

  const tabs = [
    { id: 'tracking', label: 'Mes Produits', icon: '📦' },
    { id: 'routes', label: 'Acheter', icon: '🛍️' },
    { id: 'goals', label: 'Vendre', icon: '💰' },
    { id: 'social', label: 'Transactions', icon: '📊' }
  ]

  return (
    <div className="marcher-page">
      <div className="marcher-header">
        <h3>🛒 Marché de {userData.prenom} {userData.nomFamille}</h3>
        <p className="numero-h">NumeroH: {userData.numeroH}</p>
      </div>

      <div className="marcher-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="marcher-content">
        {activeTab === 'tracking' && (
          <div className="tracking-tab">
            <h4>📦 Mes Produits</h4>
            <div className="tracking-stats">
              <div className="stat-card">
                <h5>Produits en vente</h5>
                <p>12</p>
              </div>
              <div className="stat-card">
                <h5>Produits vendus</h5>
                <p>45</p>
              </div>
            </div>
            <button className="btn" style={{ marginTop: '20px' }}>
              ➕ Ajouter un produit
            </button>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="routes-tab">
            <h4>🛍️ Acheter des Produits</h4>
            <div className="routes-grid">
              <div className="route-card">
                <h5>Parcourir le marché</h5>
                <p>Découvrez les produits disponibles</p>
                <button className="btn secondary" style={{ marginTop: '10px' }}>
                  Voir les produits
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="goals-tab">
            <h4>💰 Vendre un Produit</h4>
            <div className="goals-list">
              <div className="goal-item">
                <h5>Publier une annonce</h5>
                <p>Vendez vos produits à la communauté</p>
                <button className="btn" style={{ marginTop: '10px' }}>
                  Créer une annonce
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="social-tab">
            <h4>📊 Mes Transactions</h4>
            <div className="social-content">
              <p>Historique de vos achats et ventes</p>
              <div className="stat-card" style={{ marginTop: '20px' }}>
                <h5>Total des ventes</h5>
                <p>0 GNF</p>
              </div>
              <div className="stat-card" style={{ marginTop: '10px' }}>
                <h5>Total des achats</h5>
                <p>0 GNF</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}














