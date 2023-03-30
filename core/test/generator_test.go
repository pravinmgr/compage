package test

import (
	"github.com/intelops/compage/core/internal/converter/rest"
	"github.com/intelops/compage/core/internal/core"
	"github.com/intelops/compage/core/internal/handlers"
	log "github.com/sirupsen/logrus"
	"os"
	"testing"
)

func TestGenerator(t *testing.T) {
	// TODO update latest json below.
	jsonString := ""
	input := core.ProjectInput{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-project",
		Json:           jsonString,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-project")
	}()

	// retrieve project struct
	project, err := rest.GetProject(input)
	if err != nil {
		log.Errorf("err : %s", err.Error())
		return
	}
	// trigger project generation
	if err0 := handlers.Handle(project); err0 != nil {
		log.Errorf("err : %s", err0.Error())
	}
}
