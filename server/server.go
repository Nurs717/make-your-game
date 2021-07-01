package server

import (
	"fmt"
	"log"
	"net/http"
	"text/template"
)

const indexFile = "index.html"
const ScoreBoardFile = "scoreboard/scoreboard.html"

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
	http.HandleFunc("/api/scoreboard", enableCORS(scoreBoardHandler))

	fmt.Println("Gaming on localhost:8080...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func gameIndexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl.Execute(w, nil)
}

func scoreBoardHandler(w http.ResponseWriter, r *http.Request) {

}
