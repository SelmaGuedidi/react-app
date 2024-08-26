import React from 'react';

const NavigationBar = () => {
  return (
    <nav className="navigation-bar">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Transactions</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;