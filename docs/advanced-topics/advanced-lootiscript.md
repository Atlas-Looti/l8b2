# Advanced LootiScript

## Prototypes for Core Types

LootiScript introduces prototypes for Object, List, String, Number, and Function. Prototypes are collections of functions that you can define and then use on values of the corresponding type.

### Example: String Prototype

We'll create a function that, when applied to a string, returns the same string with the first letter capitalized:

```lua
String.capitalized = function()
  if this.length > 0 then
    this[0].toUpperCase() + this.substring(1)
  else
    ""
  end
end
```

**Note:** In the defined function, `this` refers to the string instance on which the function is called.

We can then use this function on any string value like this:

```lua
lastname = "doe".capitalized()
firstname = "john"
firstname = firstname.capitalized()
city = "paris"
print(firstname + " " + lastname + " " + city.capitalized())
```

**Note:** String values are always constant. Any function that appears to modify a string does not change the original string value, only returns a new string value containing the modified string.

### Example: List Prototype

```lua
List.modulo = function(mod)
  local result = []
  for i = 0 to this.length - 1 by mod do
    result += this[i]
  end
  result
end
```

After defining it, you can call the `modulo` function on a list, which will return a subset of elements in the list:

```lua
[1,2,3,4,5,6,7,8].modulo(2)
// Result: [1,3,5,7]
```

## Operator Overloading

### For Classes

When creating a class, you can define how LootiScript operators `+ - * / %` are applied to object instances of your class.

```lua
Vector3 = class
  constructor = function(x, y, z)
    this.x = x
    this.y = y
    this.z = z
  end

  "+" = function(a, b)
    new Vector3(a.x + b.x, a.y + b.y, a.z + b.z)
  end
end
```

When you define a binary operator like `+`, think that it will be used like this: `a + b`. `a` and `b` will be the two arguments for your overloading function.

**Note:** When `a <op> b` is found in code and `a` is not a number, the operation to be performed is determined based on the type or class of `a`. If `a` is a List and `<op>` is defined in the List prototype, then that's what will be done. If `a` is an instance of the Vector3 class and the class defines `<op>`, then that's what will be done.

**Special case:** When `-b` is found in code; if the prototype or parent class of `b` is found to define the binary operator `-`, then the function `(a, b)` is called with `a` set to `0` and `b` set to the value of `b`. Thus, you can implement the `-` operator for your Vector3 class like this:

```lua
Vector3."-" = function(a, b)
  if a then
    new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
  else
    new Vector3(-b.x, -b.y, -b.z)
  end
end
```

### For Core Types

You can also overload operators for LootiScript's core types. Example:

```lua
String."*" = function(a, b)
  local result = a
  for i = 2 to b by 1 do
    result += a
  end
  result
end
```

Usage:

```lua
"abc" * 5
// Result: "abcabcabcabcabc"
```

**Note:** Overloading binary operators `+ - * / %` for the Number prototype is not supported!

## Manipulating Classes / Prototypes

You can manipulate classes and prototypes dynamically to add or change behavior:

```lua
// Add new method to List
List.sum = function()
  local total = 0
  for i = 0 to this.length - 1 do
    total += this[i]
  end
  total
end

// Use new method
numbers = [1, 2, 3, 4, 5]
print(numbers.sum())  // Result: 15
```

## Embedding JavaScript

You can now embed JavaScript code within your LootiScript code. This allows you to add features to your application that may not be provided by the L8B core API.

**Note:** You cannot call LootiScript functions or create LootiScript class instances from your JavaScript code. You can call JavaScript functions or create JavaScript class instances from your LootiScript code.

**Note:** JavaScript is currently supported on all target platforms for your L8B application, as they all rely on the HTML5 engine. In the future, more export targets may be added, which may not include JavaScript support.

### How to Run JavaScript

#### 1. Embed Snippet

You can run JavaScript code by calling `system.javascript(javascript_code)`. Example:

```lua
system.javascript("""
  this.setFullscreen = function() { 
    document.body.requestFullscreen() 
  } ;
""")
```

Your JavaScript code is executed with `this` set to the LootiScript global context. Thus, by setting `this.setFullscreen = ...`, you create a global function that you can then call from your LootiScript code.

#### 2. Create JavaScript File

You can create a complete JavaScript file by starting your file with `// javascript` followed by a newline.

Example:

```lua
// javascript

this.setFullscreen = function() { 
  document.body.requestFullscreen() 
} ;
```

The LootiScript global context is also provided as a variable named `global`. You can write:

```lua
// javascript

global.setFullscreen = function() { 
  document.body.requestFullscreen() 
} ;
```

### Example JavaScript Interop Usage

```lua
// Add JavaScript function to access localStorage
system.javascript("""
  this.saveToLocalStorage = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  this.loadFromLocalStorage = function(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };
""")

// Use from LootiScript
init = function()
  // Save data
  saveToLocalStorage("playerName", "John")
  
  // Load data
  playerName = loadFromLocalStorage("playerName")
  print("Player: " + playerName)
end
```

## Best Practices

1. **Use Prototypes Wisely**: Only add methods to prototypes if truly necessary and will be used widely.

2. **Document Extensions**: If you add methods to prototypes, document them well so other developers understand the behavior.

3. **JavaScript Interop**: Use JavaScript interop only for features not available in the L8B API. Avoid using it for core game logic.

4. **Operator Overloading**: Make sure operators you overload have clear and intuitive semantics for your class.

5. **Performance**: Keep in mind that adding methods to prototypes can affect performance if done repeatedly. Do it once during initialization.
