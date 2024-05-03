
    const defaultTheme = "hg-theme-default";
    let selectedInput;
    let Keyboard = window.SimpleKeyboard.default;
    let shifted = false;
    let keyboard = new Keyboard({
    theme: defaultTheme,
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    display: {
    '{bksp}': 'backspace',
    '{enter}': 'enter',
    '{shift}': 'shift',
    '{lock}': 'caps',
    '{tab}': 'tab',
    '{space}': 'space',
    }
    });
    if(isLocalHost)
        setKeyboardListeners(keyboard);

    function setKeyboardListeners(keyboard){
        document.querySelectorAll(".input").forEach(input => {
        input.addEventListener("focus", onInputFocus);
        input.addEventListener("input", onChange);

        });

        document.addEventListener("click", (event) => {
        if (
            /**
             * Hide the keyboard when you're not clicking it or when clicking an input
             * If you have installed a "click outside" library, please use that instead.
             */
            keyboard.options.theme.includes("show-keyboard") &&
            !event.target.className.includes("input") &&
            !event.target.className.includes("hg-button") &&
            !event.target.className.includes("hg-row") &&
            !event.target.className.includes("simple-keyboard")
        ) {
            hideKeyboard();
        }
        });
    }
    function showKeyboard() {
    keyboard.setOptions({
        theme: `${defaultTheme} show-keyboard`
    });
    }

    function hideKeyboard() {
    keyboard.setOptions({
        theme: defaultTheme
    });
    }

    function onInputFocus(event) {
    selectedInput = `#${event.target.id}`;
    showKeyboard();
    keyboard.setOptions({
        inputName: event.target.id
    });
    }

    function onInputChange(event) {
        console.log("Setting input");
    keyboard.setInput(event.target.value, event.target.id);
    }

    function onChange(input) {
        /* how can I detect first fuggin' time???*/ //see onkeypress for fix
            console.log("Input changed", input);
            //console.log("Existing input: " +document.querySelector(selectedInput || ".input").value)
            document.querySelector(selectedInput || ".input").value = input;
            showHideSave();

    }

    function onKeyPress(button) {
    //console.log("Button pressed", button);
    let inputId = selectedInput.replace('#','');
    let val = document.getElementById(inputId).value;

    keyboard.setInput(val,inputId);
    if(shifted){
        keyboard.setOptions({
            layoutName: "default"
        });
        shifted = false;
    }
    /**
     * Shift functionality
     */
    if (button === "{lock}" || button === "{shift}") handleShiftButton(button);
    }

    function handleShiftButton(button) {
    let currentLayout = keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    keyboard.setOptions({
        layoutName: shiftToggle
    });
    if(button === "{shift}")
        shifted = true;
 
    }
//}