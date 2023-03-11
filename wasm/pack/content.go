package pack

import (
	"bytes"
	"errors"
	"strings"

	"github.com/buger/jsonparser"
)

// [path]key
type packContent map[string][]byte

func toContentsJson(contents packContent) []byte {
	var buf bytes.Buffer
	buf.WriteString("{\"content\":[")
	for path, key := range contents {
		buf.WriteString("{\"path\":\"")
		buf.WriteString(strings.ReplaceAll(path, "\"", "\\\""))
		buf.WriteString("\",\"key\":\"")
		buf.WriteString(strings.ReplaceAll(string(key), "\"", "\\\""))
		buf.WriteString("\"},")
	}
	buf.Truncate(buf.Len() - 1)
	buf.WriteString("]}")
	return buf.Bytes()
}

func fromContentsJson(data []byte) (contents packContent, err error) {
	defer func() {
		if rec := recover(); rec != nil {
			recErr, ok := rec.(error)
			if ok {
				err = recErr
			} else {
				err = errors.New("panic occurred")
			}
		}
	}()

	contents = make(packContent)
	jsonparser.ArrayEach(data, func(value []byte, dataType jsonparser.ValueType, offset int, err error) {
		if err != nil {
			panic(err)
		}
		var path, key []byte
		path, _, _, err = jsonparser.Get(value, "path")
		if err != nil {
			panic(err)
		}
		key, _, _, err = jsonparser.Get(value, "key")
		if err != nil {
			panic(err)
		}

		contents[string(path)] = key
	}, "content")

	return contents, err
}
