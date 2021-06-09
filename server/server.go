package server

import (
	"fmt"
	"log"
	"net/http"
	"text/template"
)

const indexFile = "index.html"

var tmpl *template.Template

func Run() {
	var err error
	tmpl, err = template.ParseGlob(indexFile)
	if err != nil {
		log.Fatalf("Can't load template: %s", err.Error())
	}

	src := http.FileServer(http.Dir("./src"))
	http.Handle("/src/", http.StripPrefix("/src/", src))
	http.HandleFunc("/", enableCORS(gameIndexHandler))

	fmt.Println("Gaming on localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func gameIndexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl.Execute(w, nil)
}

func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length")
		next.ServeHTTP(w, r)
	}
}
