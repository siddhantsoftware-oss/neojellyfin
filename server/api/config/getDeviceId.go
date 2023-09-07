package config

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GetDeviceId(c *gin.Context) {
	deviceId, err := c.Cookie("deviceId")
	if err != nil {
		deviceId = uuid.NewString()
	}
	c.String(200, deviceId)
}
