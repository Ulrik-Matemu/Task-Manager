import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  background: linear-gradient(to right, #4a00e0, #8e2de2);
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
`;

const Brand = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(to right, #4a00e0, #8e2de2);
    flex-direction: column;
    padding: 1rem;
    z-index: 1000;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    transform: ${({ $isOpen }) =>
      $isOpen ? "translateY(0)" : "translateY(-100%)"};
    opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
    pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
  }
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff6b81;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log("Toggle menu clicked. Current state:", isMenuOpen);
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    console.log("Menu state changed:", isMenuOpen);
  }, [isMenuOpen]);

  return (
    <HeaderWrapper className="sticky-header">
      <Nav>
        <Brand to="/">Task Manager by Ulrik</Brand>
        <HamburgerButton onClick={toggleMenu}>
          {isMenuOpen ? "✕" : "☰"}
        </HamburgerButton>
        <NavLinks $isOpen={isMenuOpen}>
          {isAuthenticated ? (
            <>
              <StyledLink to="/tasklist" onClick={() => setIsMenuOpen(false)}>
                Task List
              </StyledLink>
              <StyledLink to="/addTask" onClick={() => setIsMenuOpen(false)}>
                Add Task
              </StyledLink>
              <StyledLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </StyledLink>
              <StyledLink to="/teams" onClick={() => setIsMenuOpen(false)}>
                Your Teams
              </StyledLink>
              <StyledLink
                to="/create-team"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Team
              </StyledLink>
              <LogoutButton
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </LogoutButton>
            </>
          ) : (
            <>
              <StyledLink to="/" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </StyledLink>
              <StyledLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </StyledLink>
            </>
          )}
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
}
