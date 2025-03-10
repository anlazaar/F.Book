package middleware

import (
	Cruds "forum/server/Api"
	"net/http"
)


func ValidateSession(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        // Get the session cookie
        cookie, err := r.Cookie("Session_ID")
        if err != nil {
            // No session cookie found, redirect to sign-in page
            http.Redirect(w, r, "/Sign_In", http.StatusSeeOther)
            return
        }

        // Validate the session ID and get the user ID
        sessionID := cookie.Value
        _, valid := Cruds.ValidateSessionIDAndGetUserID(sessionID)
        if !valid {
            // Invalid session, redirect to sign-in page
            http.Redirect(w, r, "/Sign_In", http.StatusSeeOther)
            return
        }
        
        next(w, r)
    }
}