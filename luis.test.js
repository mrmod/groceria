const rewire = require("rewire")
const luis = rewire("./luis")
const onSuccessLog = luis.__get__("onSuccessLog")
// @ponicode
describe("luis.predict", () => {
    test("0", () => {
        let callFunction = () => {
            luis.predict("Foo bar", "2021-07-29T23:03:48.812Z", "Unknown Error")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            luis.predict("Foo bar", "2021-07-29T23:03:48.812Z", "Unable to find your git executable - Shutdown SickBeard and EITHER <a href=\"http://code.google.com/p/sickbeard/wiki/AdvancedSettings\" onclick=\"window.open(this.href); return false;\">set git_path in your config.ini</a> OR delete your .git folder and run from source to enable updates.")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            luis.predict("This is a Text", "2021-07-29T20:12:53.196Z", "Invalid data: No data found in any of the field(s)!!!")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            luis.predict("This is a Text", "2021-07-29T17:54:41.653Z", "Error:")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            luis.predict("foo bar", "2021-07-29T15:31:46.922Z", "<error_message>%s</error_message>")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            luis.predict(undefined, "", undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("onSuccessLog", () => {
    test("0", () => {
        let callFunction = () => {
            onSuccessLog(500)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            onSuccessLog(400)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            onSuccessLog(404)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            onSuccessLog(429)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            onSuccessLog(200)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            onSuccessLog(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})
