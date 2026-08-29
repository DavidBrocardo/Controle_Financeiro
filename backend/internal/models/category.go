package models

// Category represents a budget category.
type Category struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Type  string `json:"type"`
	Color string `json:"color,omitempty"`
}
