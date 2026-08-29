package services

import (
	"controle-financeiro/backend/internal/models"
	"controle-financeiro/backend/internal/repositories"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService() *UserService {
	return &UserService{repo: repositories.NewUserRepository()}
}

func (s *UserService) CreateUser(name, email string) models.User {
	return models.User{
		ID:    "user-generated-id",
		Name:  name,
		Email: email,
	}
}
