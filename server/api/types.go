package types

type ErrorResponse struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
	Address string `json:"address"`
}
