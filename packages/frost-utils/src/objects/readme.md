> A small collection of useful object helper methods

## Usage

### objectEvery

```js
objectEvery(object, callback, context)
```

Executes a callback once for each enumerable property in an object until it finds one that returns a falsy value. This is an object version of Array.prototype.every.

```js
const obj = { first: 'test', second: 7 };
everyObject(obj, (value, name) => {
    if (value) {
        console.log(value);
    }
});
// This will return true
```

### objectFilter

```js
objectFilter(object, callback, context)
```

Executes a callback once for each enumerable property in the object and creates a new object contains all of the values for which the callback returns a true value. This is an object version of Array.prototype.filter

```js
const obj = { first: 5, second: 2, third: 6 };
const filtered = filterObject(obj, value => value >= 5);
// returns { first: 5, third: 6 };
```

### objectForEach

```js
objectForEach(obj, callback, context)
```

Executes a callback once for each enumerable property in the object. This is an object version of Array.prototype.forEach

```js
const obj = { first: 5, second: 2, third: 6 };
forEachObject(obj, (name, value) => value *= 2);
console.log(obj);
// Would print { first: 10, second: 4, third: 12 }
```

### objectMap

```js
objectMap(object, callback, context)
```

Executes a callback once for each enumerable property in the object and constructs a new object with the results. This is an object version of Array.prototype.map

```js
const obj = { first: 4, second: 3, third: 12 };
const newObject = objectMap(obj, (name, value) => value *= 2);
console.log(newObject);
// Would print { first: 8, second: 6, third: 24 };
```

objectRemoveEmpty

```js
objectRemoveEmpty(object)
```

Iterates through the enumerable properties on an object and returns a new object containing all of the defined (not null or undefined) properties in the object

```js
const obj = { first: undefined, second: 2, third: null };
const newObj = objectRemoveEmpty(obj);
console.log(newObj);
// Returns { second: 2 }
```

### objectSome

```js
objectSome(object, callback, context)
```

Executes a callback once for each enumerable property in the object until it finds one where the callback returns a truthy value. This is an object version of Array.prototype.some

```
const obj = { first: 1, second: 2 };
objectSome(obj, (name, value) => {
    if (name === 'first') {
        if (value > 1) {
            return false;
        }
    }
});
// This will return true
