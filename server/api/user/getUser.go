package user

import (
	types "server/api"

	"github.com/gin-gonic/gin"
)

type GetUserRequest struct {
	Username string
	Pw       string
}

type UserType struct {
}

type Response struct {
	Data string `json:"data"`
}

func GetUserId(c *gin.Context) {
	userId, err := c.Cookie("userId")
	if err != nil {
		c.JSON(400, types.ErrorResponse{
			Message: "Could not find userId",
		})
	}
	c.JSON(200, Response{
		Data: userId,
	})

}
