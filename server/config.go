package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Config struct {
	Message  string `json:"message"`
	Address  string `json:"address"`
	Username string `json:"username"`
}

type ServerInfo struct {
	LocalAddress          string
	ServerName            string
	Version               string
	ProductName           string
	OperatingSystem       string
	Id                    string
	StartupWizardComplete bool
}

func getConfig(c *gin.Context) {
	address, err := c.Cookie("address")
	if err != nil {
		res := Config{
			Message: "Server address is not present",
		}
		c.JSON(http.StatusNotFound, res)
	}

	serverInfo, err := http.Get(address + "/System/Info/Public")
	if err != nil {
		res := Config{
			Message: "Server is not valid",
		}
		c.JSON(http.StatusBadRequest, res)
		panic("Server is not valid")
	}
	var readableServerInfo ServerInfo
	json.NewDecoder(serverInfo.Body).Decode(&readableServerInfo)
	c.SetCookie("serverId", readableServerInfo.Id, 10000000, "/", "localhost", false, true)
	c.SetCookie("serverName", readableServerInfo.ServerName, 10000000, "/", "localhost", false, true)
	c.SetCookie("serverVersion", readableServerInfo.Version, 10000000, "/", "localhost", false, true)

	username, err := c.Cookie("username")
	if err != nil {
		res := Config{
			Message: "Username is not present",
			Address: address,
		}
		c.JSON(http.StatusBadRequest, res)
		panic("Username is not present")
	}
	password, err := c.Cookie("password")
	if err != nil {
		res := Config{
			Message: "Password is not present",
			Address: address,
		}
		c.JSON(http.StatusBadRequest, res)
		panic("Password is not present")
	}

	type UserSettings struct {
		Username string `json:"Username"`
		Pw       string `json:"Pw"`
	}

	user := UserSettings{
		Username: username,
		Pw:       password,
	}

	marshalled, _ := json.Marshal(user)

	req, _ := http.NewRequest("POST", address, bytes.NewReader(marshalled))

	deviceId, err := c.Cookie("deviceId")
	if err != nil {
		deviceId = uuid.NewString()
		c.SetCookie("deviceId", deviceId, 10000000, "/", "localhost", false, true)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "MediaBrowser Client=\"NeoJellyfin\", Device=\"Chrome\", DeviceId=\""+deviceId+"\", Version=\"0.3.1\", Token=\"\"")
	client := http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, Config{
			Message: "User not authorized",
		})
	}
	c.JSON(http.StatusOK, res)

}

type BodyRequest struct {
	ServerAddress string `json:"ServerAddress"`
}

func addServerAddress(c *gin.Context) {
	var serverAddress BodyRequest
	c.BindJSON(&serverAddress)
	res, err := http.Get(serverAddress.ServerAddress + "/System/Info/Public")
	if err != nil {
		c.JSON(404, Config{
			Message: "URL is not valid",
		})
	}
	var readableServerInfo ServerInfo
	json.NewDecoder(res.Body).Decode(&readableServerInfo)
	c.SetCookie("serverId", readableServerInfo.Id, 10000000, "/", "localhost", false, true)
	c.SetCookie("serverName", readableServerInfo.ServerName, 10000000, "/", "localhost", false, true)
	c.SetCookie("serverVersion", readableServerInfo.Version, 10000000, "/", "localhost", false, true)
	c.SetCookie("address", serverAddress.ServerAddress, 50000000, "/", "localhost", false, true)
	c.JSON(http.StatusOK, Config{
		Message: "Server is valid",
	})
}

type UserInfo struct {
	Username string `json:"Username"`
	Pw       string `json:"Pw"`
}

func logUserIn(c *gin.Context) {
	var userInfo UserInfo
	c.BindJSON(&userInfo)
	res, err := makeRequestToJellyfin("POST", "/Users/AuthenticateByName", userInfo, c)
	if err != nil {
		c.JSON(http.StatusBadRequest, Config{Message: "There was an error with the Jellyfin server"})
		panic(err)
	}
	if res.StatusCode == 200 {
		c.SetCookie("username", userInfo.Username, int(time.Second)*604800, "/", "localhost", false, true)
		c.SetCookie("password", userInfo.Pw, int(time.Second)*604800, "/", "localhost", false, true)
		type User struct {
			Id string
		}
		type Data struct {
			User User
		}
		var data Data
		json.NewDecoder(res.Body).Decode(&data)
		c.SetCookie("userId", data.User.Id, int(time.Second)*604800, "/", "localhost", false, true)

	}
	c.JSON(res.StatusCode, res.Body)
}

type Response struct {
	Code int
	Body any
}

func makeRequestToJellyfin(method string, request string, body any, c *gin.Context) (*http.Response, error) {
	address, _ := c.Cookie("address")
	marshalled, _ := json.Marshal(body)
	req, _ := http.NewRequest("POST", address+request, bytes.NewReader(marshalled))
	deviceId, err := c.Cookie("deviceId")
	if err != nil {
		deviceId = uuid.NewString()
		c.SetCookie("deviceId", deviceId, 10000000, "/", "localhost", false, true)
	}
	accessToken, err := c.Cookie("AccessToken")

	if err != nil {
		accessToken = ""
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "MediaBrowser Client=\"NeoJellyfin\", Device=\"Chrome\", DeviceId=\""+deviceId+"\", Version=\"0.3.1\", Token=\""+accessToken+"\"")
	client := http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(req)
	return res, err
}

func getServerAddress(c *gin.Context) {
	address, err := c.Cookie("address")
	type Res struct {
		Message string `json:"message"`
		Address string `json:"address"`
	}
	if err != nil {
		c.JSON(400, Res{
			Message: "Could not find",
		})
		panic(err)
	}
	c.JSON(200, Res{
		Message: "Found successfuly",
		Address: address,
	})
}
