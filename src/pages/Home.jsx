import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import financeService from '../services/financeService';
import './Home.css';

const Home = () => {
  const [featuredMethods, setFeaturedMethods] = useState([]);

  useEffect(() => {
    const fetchFeaturedMethods = async () => {
      try {
        const response = await financeService.getAllFinanceMethods();
        // Get first 3 methods as featured
        setFeaturedMethods(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured methods:', error);
      }
    };

    fetchFeaturedMethods();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Finance Tracker</h1>
          <p className="hero-subtitle">Your Complete Solution for Financial Management and Tracking</p>
          <p>Take control of your finances with proven methods and expert guidance</p>
          <Link to="/project-topic" className="cta-button">
            Explore Finance Methods
          </Link>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <h2>Why Financial Management Matters</h2>
          <div className="intro-grid">
            <div className="intro-card">
              <div className="intro-icon">📊</div>
              <h3>Track Your Spending</h3>
              <p>Monitor where your money goes and identify areas for improvement</p>
            </div>
            <div className="intro-card">
              <div className="intro-icon">💰</div>
              <h3>Build Wealth</h3>
              <p>Create sustainable savings habits and grow your financial portfolio</p>
            </div>
            <div className="intro-card">
              <div className="intro-icon">🎯</div>
              <h3>Achieve Goals</h3>
              <p>Set financial goals and track progress with actionable insights</p>
            </div>
            <div className="intro-card">
              <div className="intro-icon">🔒</div>
              <h3>Secure Future</h3>
              <p>Plan for retirement and emergencies with confidence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Benefits of Financial Planning</h2>
          <div className="benefits-content">
            <div className="benefit-item">
              <h3>🎓 Financial Freedom</h3>
              <p>Gain independence and reduce financial stress through proper planning and budgeting</p>
            </div>
            <div className="benefit-item">
              <h3>📈 Smart Investments</h3>
              <p>Make informed decisions about where to invest your hard-earned money</p>
            </div>
            <div className="benefit-item">
              <h3>🛡️ Risk Management</h3>
              <p>Protect yourself and your family from unexpected financial challenges</p>
            </div>
            <div className="benefit-item">
              <h3>⚡ Better Decisions</h3>
              <p>Develop skills to make confident financial choices in any situation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="tips-section">
        <div className="container">
          <h2>Essential Tips for Budgeting & Saving</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-number">1</span>
              <h4>Create a Budget</h4>
              <p>Track income and expenses to understand your financial situation</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">2</span>
              <h4>Emergency Fund</h4>
              <p>Save 3-6 months of expenses for unexpected situations</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">3</span>
              <h4>Pay Yourself First</h4>
              <p>Automate savings before spending on discretionary items</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">4</span>
              <h4>Reduce Debt</h4>
              <p>Prioritize high-interest debt and create a payoff plan</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">5</span>
              <h4>Track Spending</h4>
              <p>Review expenses regularly to stay within your budget</p>
            </div>
            <div className="tip-card">
              <span className="tip-number">6</span>
              <h4>Invest Wisely</h4>
              <p>Start investing early to benefit from compound growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Methods Section */}
      {featuredMethods.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2>Featured Finance Methods</h2>
            <div className="featured-grid">
              {featuredMethods.map((method) => (
                <div key={method._id} className="featured-card">
                  <img src={method.imageUrl} alt={method.title} />
                  <div className="featured-content">
                    <span className="featured-category">{method.category}</span>
                    <h3>{method.title}</h3>
                    <p>{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="featured-cta">
              <Link to="/project-topic" className="secondary-button">
                View All Methods
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Take Control of Your Finances?</h2>
          <p>Start your journey to financial freedom today</p>
          <Link to="/contact" className="cta-button">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
