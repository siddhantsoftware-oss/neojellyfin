package main

import (
	cfg "server/api/config"
	"server/api/user"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"POST", "GET", "PUT", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/config", cfg.GetConfig)
	router.POST("/config/server", cfg.AddServerAddress)
	router.POST("/config/user", cfg.LogUserIn)
	router.GET("/config/address", cfg.GetServerAddress)
	router.GET("/user", user.GetUserId)
	router.GET("/config/deviceId", cfg.GetDeviceId)
	router.Run(":3000")
}
