import React from 'react';
import { useAuth } from '../context/AuthContext';
import './FinanceCard.css';

const FinanceCard = ({ method, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="finance-card">
      <div className="finance-card-image">
        <img src={method.imageUrl} alt={method.title} />
      </div>
      
      <div className="finance-card-content">
        <div className="finance-card-category">{method.category}</div>
        <h3 className="finance-card-title">{method.title}</h3>
        <p className="finance-card-description">{method.description}</p>
        
        <div className="finance-card-methodology">
          <h4>Methodology:</h4>
          <p>{method.methodology}</p>
        </div>
        
        {method.benefits && method.benefits.length > 0 && (
          <div className="finance-card-benefits">
            <h4>Benefits:</h4>
            <ul>
              {method.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
        
        {isAdmin() && (
          <div className="finance-card-actions">
            <button onClick={() => onEdit(method)} className="btn-edit">
              Edit
            </button>
            <button onClick={() => onDelete(method._id)} className="btn-delete">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceCard;
