package services

import "controle-financeiro/backend/internal/models"

type AuthService struct{}

func NewAuthService() *AuthService {
	return &AuthService{}
}

func (s *AuthService) GenerateToken(userID string) models.Token {
	return models.Token{
		AccessToken:  "token-for-" + userID,
		RefreshToken: "refresh-token-for-" + userID,
	}
}
