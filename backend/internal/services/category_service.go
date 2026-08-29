package services

import "controle-financeiro/backend/internal/models"

type CategoryService struct{}

func NewCategoryService() *CategoryService {
	return &CategoryService{}
}

func (s *CategoryService) CreateCategory(name, kind, color string) models.Category {
	return models.Category{
		ID:    "category-generated-id",
		Name:  name,
		Type:  kind,
		Color: color,
	}
}
