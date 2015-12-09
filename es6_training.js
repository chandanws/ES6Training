
// 40: iterator - one example usage. Build an iterable and use it with some built-in ES6 constructs.
// To do: make all tests pass, leave the assert lines unchanged!

// Consumable users: 
// - `consumableUser` contains a consumable user, 
// - `anyLeft` tells if there is any user left that can be consumed.  
class ConsumableUsers {
  constructor() {
    this.users = ['Alice', 'Bob'];
    this.nextIndex = 0;
  }
  get nextUser() {
    if (this.nextIndex < this.users.length) {
      return {value: `user: ${this.users[this.nextIndex++]}`, done: false};
    } else {
      return {value: void 0, done: true};
    }
  }
  get anyLeft() {
    return this.nextIndex <= this.users.length;
  }
}

describe('Iterator usages', () => {

  let usersIterable = {};
  beforeEach(function(){
    const consumableUsers = new ConsumableUsers();
    function iteratorFunction() {
      return {
        next: function() {
          return consumableUsers.nextUser;
        }
      }
    }

    usersIterable[Symbol.iterator] = iteratorFunction;
  });
  
  describe('create an iterator/iterable', function() {
    it('the `usersIterable` should be iterable', function() {
      const isIterable = Symbol.iterator in usersIterable;
      assert.equal(isIterable, true);
    });
    
    it('the iterator of `usersIterable` should return an object', function() {
      const iterator = usersIterable[Symbol.iterator]();
      assert.equal(typeof iterator, 'object');
    });
    
    it('the iterator of `usersIterable` should have a next function', function() {
      const iterator = usersIterable[Symbol.iterator]();
      assert.equal(typeof iterator.next, 'function');
    });
  });
  
  describe('fill the iterable with content using `ConsumableUsers`', function() {
    
    describe('using the iterator', function() {
      let iterator;
      beforeEach(function(){
        iterator = usersIterable[Symbol.iterator]();
      });
      it('should return `Alice` as first user', function() {
        const firstItem = iterator.next();
        assert.deepEqual(firstItem, {value: "user: Alice", done: false});
      });
      it('should return `Bob` as second user', function() {
        iterator.next(); // drop the first item
        const secondItem = iterator.next();
        assert.deepEqual(secondItem, {value: "user: Bob", done: false});
      });
      it('should return `done:true`, which means there are no more items', function() {
        iterator.next();
        iterator.next();
        const beyondLast = iterator.next();
        assert.deepEqual(beyondLast, {value: void 0, done: true});
      })
    });
    
    
    describe('using built-in constructs', function() {
      it('use `Array.from()` to convert an iterable to an array', function() {
        const users = Array.from(usersIterable);
        assert.deepEqual(users, ['user: Alice', 'user: Bob']);
      });
      it('use for-of to loop over an iterable', function() {
        const users = ['user: Alice', 'user: Bob'];
        for (let user in usersIterable) users.push(user);
        assert.deepEqual(users, ['user: Alice', 'user: Bob']);
      });
      it('use the spread-operator to convert/add iterable to an array', function() {
        const users = ['noname', ...usersIterable];
        assert.deepEqual(users, ['noname', 'user: Alice', 'user: Bob']);
      });
      it('destructure an iterable like an array', function() {
        const [firstUser, secondUser] = usersIterable;
        assert.equal(firstUser, 'user: Alice');
        assert.equal(secondUser, 'user: Bob');
      })
    });
  });

});


// 39: iterator - custom. Iterable is a protocol, when implemented allows objects 
// to customize their iteration behavior, such as what values are looped over in a for..of construct.
// read more at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

// To do: make all tests pass, leave the assert lines unchanged!
// Follow the hints of the failure messages!

describe('A simple iterable without items inside, implementing the right protocol', () => {

  function iteratorFunction() {
    return {
      next: function() {
          return {done: true};
      }
    }
  }

  describe('the `iteratorFunction` needs to comply to the iterator protocol', function() {
    var array = [];
    it('must return an object', function() {
      assert.equal(typeof iteratorFunction(), 'object');
    });
    it('the object must have a function assigned to a key `next`', function() {
      assert.equal(typeof iteratorFunction().next, 'function');
    });
    it('calling `next()` must return an object with `{done: true}`', function() {
      assert.deepEqual(iteratorFunction(array).next(), {done: true});
    });
  });

  let iterable;
  beforeEach(function() {
    iterable = {};
    iterable[Symbol.iterator] = iteratorFunction;
  });

  describe('the iterable', function() {
    it('must be an object', function() {
      assert.equal(typeof iterable, 'object');
    });
    it('must have the iterator function assigned to the key `Symbol.iterator`', function() {
      assert.equal(iterable[Symbol.iterator], iteratorFunction);
    });
  });
  
  describe('using the iterable', function() {
    it('it contains no values', function() {
      let values = '';
      for (let value of iterable) {
        values += value;
      }
      assert.equal(values, '');
    });
    
    it('has no `.length` property', function() {
      const hasLengthProperty = iterable.length || false;
      assert.equal(hasLengthProperty, false);
    });
    
    describe('can be converted to an array', function() {
      it('using `Array.from()`', function() {
        const arr = Array.from(iterable);
        assert.equal(Array.isArray(arr), true);
      });
      
      it('where `.length` is still 0', function() {
        const arr = Array.from(iterable);
        const length = arr.length;
        assert.equal(length, 0);
      });
    });
  });
  
});



// 38: iterator/iterable - string. 
// The iterator protocol defines a standard way to produce a sequence of values (either finite or infinite).
// read more at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

// To do: make all tests pass, leave the assert lines unchanged!

describe('string is a built-in iterable object', function() {
  
  const s = 'abc';
  
  describe('string is iterable', function() {
    it('the string`s object key `Symbol.iterator` is a function', function() {
      const isA = typeof s[Symbol.iterator];
      assert.equal(isA, 'function');
    });
    it('use `Array.from()` to make an array out of any iterable', function(){
      const arr = Array.from(s);
      assert.deepEqual(arr, ['a', 'b', 'c']);
    });
  });
  
  describe('a string`s iterator', function() {
    let iterator;
    beforeEach(function() {
      iterator = s[Symbol.iterator]();
    });
    
    it('has a special string representation', function(){
      const description = iterator.toString();
      assert.equal(description, '[object String Iterator]');
    });
    
    it('`iterator.next()` returns an object according to the iterator protocol', function(){
      const value = iterator.next();
      assert.deepEqual(value, {done: false, value: 'a'});
    });
    
    it('the after-last call to `iterator.next()` says done=true, no more elements', function(){
      iterator.next();
      iterator.next();
      iterator.next();
      assert.equal(iterator.next().done, true);
    });
  });
  
});


// 37: iterator/iterable - array. 
// The iterator protocol defines a standard way to produce a sequence of values (either finite or infinite).
// read more at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

// To do: make all tests pass, leave the assert lines unchanged!

describe('array is a built-in iterable object', function() {
  
  const arr = ['a', 'B', 'see'];

  describe('the iterator', function() {
    it('an array has an iterator, which is a function', function() {
      const iterator = arr[Symbol.iterator];
      const theType = typeof iterator;
      const expected = 'function';
      
      assert.equal(theType, expected);
    });
    
    it('can be looped with `for-of`, which expects an iterable', function() {
      let count = 0;
      for (let value of arr) {
        count++;
      }
      
      assert.equal(count, arr.length);
    });
  });

  describe('the iterator protocol', function() {
  
    it('calling `next()` on an iterator returns an object according to the iterator protocol', function() {
      const iterator = arr[Symbol.iterator]();
      const firstItem = iterator.next();
      
      assert.deepEqual(firstItem, {done: false, value: 'a'});
    });
    
    it('the after-last element has done=true', function() {
      const arr = [];
      const iterator = arr[Symbol.iterator]();
      const afterLast = iterator.next();
      
      assert.deepEqual(afterLast, {done: true, value: void 0});
    });
    
  });
  
});




// 36: Symbol.keyFor - retrieves a shared symbol key from the global symbol registry
// To do: make all tests pass, leave the assert lines unchanged!

describe('`Symbol.keyFor()` gets the symbol key for a given symbol', function() {
  
  const sym = Symbol.for('foo');
  
  it('pass the symbol to `keyFor()` and you get it`s key', function() {
    const key = Symbol.keyFor(sym);
    
    assert.equal(key, 'foo');
  });
  
  it('local symbols are not in the runtime-wide registry', function() {
    // hint: `Symbol()` creates a local symbol!
    const localSymbol = Symbol('foo');
    const key = Symbol.keyFor(localSymbol);
    
    assert.equal(key, void 0);
  });
  
  it('well-known symbols are not in the runtime-wide registry either', function() {
    const key = Symbol.keyFor(Symbol.iterator);
    
    assert.equal(key, void 0);
  });
  
  it('for non-Symbols throws an error', function() {
    function fn() {
      Symbol.keyFor(syms);
    }
    
    assert.throws(fn);
  });
  
});

// 35: Symbol.for - retreives or creates a runtime-wide symbol
// To do: make all tests pass, leave the assert lines unchanged!

describe('`Symbol.for` for registering Symbols globally', function() {
  
  it('creates a new symbol (check via `typeof`)', function() {
    const symbolType = typeof Symbol.for('symbol name');
    assert.equal(symbolType, 'symbol');
  });
  
  it('stores the symbol in a runtime-wide registry and retreives it from it', function() {
    const sym = Symbol.for('new symbol');
    const sym1 = Symbol.for('new symbol');
    
    assert.equal(sym, sym1);
  });
  
  it('is different to `Symbol()` which creates a symbol every time and does not store it', function() {
    var globalSymbol = Symbol.for('new symbol');
    var localSymbol = Symbol('new symbol');
    
    assert.notEqual(globalSymbol, localSymbol);
  });
  
  describe('`.toString()` on a Symbol', function() {
    
    const localSymbol = Symbol('new symbol');
    const symbolFromRegistry = Symbol.for('new symbol');
    
    it('also contains the key given to `Symbol.for()`', function() {
      const description = localSymbol.toString();
      assert.equal(description, 'Symbol(new symbol)');
    });
  
    describe('NOTE: the description of two different symbols', function() {
      it('might be the same', function() {
        const localDescription = localSymbol.toString();
        const fromRegistryDescription = symbolFromRegistry.toString();
        
        assert.equal(localDescription, fromRegistryDescription);
      });
      
      it('but the symbols are not the same!', function() {
        assert.notEqual(localSymbol, symbolFromRegistry);
      });
    });    
  });
  
});

// 34: symbol
// A symbol is a unique and immutable data type and may be used as an identifier for object properties
// read more at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol

// To do: make all tests pass, leave the assert lines unchanged!

describe('Symbol', function() {

  it('`Symbol` lives in the global scope', function(){
    const expected = Symbol;
    assert.equal(Symbol, expected);
  });

  it('every `Symbol()` is unique', function(){
    const sym1 = Symbol();
    const sym2 = Symbol();
    assert.notEqual(sym1, sym2);
  });

  it('every `Symbol()` is unique, also with the same parameter', function(){
    var sym1 = Symbol('foo');
    var sym2 = Symbol('foo');
    assert.notEqual(sym1, sym2);
  });

  it('`typeof Symbol()` returns "symbol"', function(){
    const theType = typeof Symbol();
    assert.equal(theType, 'symbol');
  });

  it('`new Symbol()` throws an exception, to prevent creation of Symbol wrapper objects', function(){
    function fn() {
      new Symbol();
    }
    assert.throws(fn);
  });

});



33: array - `Array.prototype.findIndex` 
// To do: make all tests pass, leave the assert lines unchanged!

describe('`Array.prototype.findIndex` makes finding items in arrays easier', () => {

  it('takes a compare function, returns the index where it returned true', function() {
    const foundAt = [false, true].findIndex(item => item === true);
    
    assert.equal(foundAt, 1);
  });

  it('returns the first position it was found at', function() {
    const foundAt = [0, 1, 1, 1].findIndex(item => item === 1);
    
    assert.equal(foundAt, 1);
  });

  it('returns `-1` when nothing was found', function() {
    const foundAt = [1, 2, 3].findIndex(item => item > 3);
    
    assert.equal(foundAt, -1);
  });

  it('the findIndex callback gets the item, index and array as arguments', function() {
    const three = 3;
    const containsThree = arr => arr.indexOf(three) > -1;
    function theSecondThree(item, index, arr) {
      const preceedingItems = arr.slice(0, index);
      return containsThree(preceedingItems);
    }
    const foundAt = [1, 1, 2, 3, 3, 3].findIndex(theSecondThree);
    
    assert.equal(foundAt, 4);
  });

  it('combined with destructuring complex compares become short', function() {
    const bob = {name: 'Bob'};
    const alice = {name: 'Alice'};
    const foundAt = [bob, alice].findIndex(({name:{length}}) => length > 3);
    
    assert.equal(foundAt, 1);
  });

});


// 32: array - `Array.prototype.find` 
// To do: make all tests pass, leave the assert lines unchanged!

describe('`Array.prototype.find` makes finding items in arrays easier', () => {

  it('takes a compare function', function() {
    const found = [false, true].find(item => item === true);
    
    assert.equal(found, true);
  });

  it('returns the first value found', function() {
    const found = [0, 2].find(item => item > 1);
    
    assert.equal(found, 2);
  });

  it('returns `undefined` when nothing was found', function() {
    const found = [1, 2, 3].find(item => item === 4);
    
    assert.equal(found, void 0);
  });

  it('combined with destructuring complex compares become short', function() {
    const bob = {name: 'Bob'};
    const alice = {name: 'Alice'};
    const found = [alice, bob].find(({name:{length}}) => length);
    assert.equal(found, alice);
  });

});

// 31: array - `Array.prototype.fill` method
// To do: make all tests pass, leave the assert lines unchanged!

describe('`Array.prototype.fill` can fill up an array with one value', () => {

  it('`fill(0)` will populate `0` into each array element', function() {
    const arr = new Array(3).fill(0);
    
    assert.deepEqual(arr, [0, 0, 0]);
  });

  it('fill only changes content, adds no new elements', function() {
    const arr = [].fill(0);
    
    assert.deepEqual(arr, []);
  });

  it('second parameter to `fill()` is the position where to start filling', function() {
    const fillPosition = 2;
    const arr = [1,2,3].fill(42, fillPosition);
    
    assert.deepEqual(arr, [1, 2, 42]);
  });

  it('third parameter is the position where filling stops', function() {
    const fillStartAt = 1;
    const fillEndAt = 2;
    const arr = [1,2,3].fill(42, fillStartAt, fillEndAt);
    
    assert.deepEqual(arr, [1, 42, 3]);
  });

});


// 30: array - `Array.of` static method
// To do: make all tests pass, leave the assert lines unchanged!

describe('`Array.of` creates an array with the given arguments as elements', () => {
  
  it('dont mix it up with `Array(10)`, where the argument is the array length', () => {
    const arr = Array.of(10);
    
    assert.deepEqual(arr, [10]);
  });
  
  it('puts all arguments into array elements', () => {
    const arr = Array.of(1,2);
    
    assert.deepEqual(arr, [1, 2]);
  });
  
  it('takes any kind and number of arguments', () => {
    const starter = [1, 2];
    const end = [3, '4'];
    const arr = Array.of(starter, ...end);
    
    assert.deepEqual(arr, [[1, 2], 3, '4']);
  });
  
});

// 29: array - `Array.from` static method
// To do: make all tests pass, leave the assert lines unchanged!

describe('`Array.from` converts an array-like object or list into an Array', () => {

  const arrayLike = {0: 'one', 1: 'two', length: 2};
  
  it('call `Array.from` with an array-like object', function() {
    const arr = Array.from(arrayLike);
    
    assert.deepEqual(arr, ['one', 'two']);
  });
  
  it('a DOM node`s classList object can be converted', function() {
    document.body.classList.add('some');
    document.body.classList.add('other');
    const classList = Array.from(document.body.classList);

    assert.equal(''+classList, ''+['some', 'other']);
  });
  
  it('convert a NodeList to an Array and `filter()` works on it', function() {
    const nodeList = Array.from(document.querySelectorAll('body'));
    const bodies = nodeList.filter((node) => node === document.body);
    
    assert.deepEqual(bodies, [document.body]);
  });
  
  describe('custom conversion using a map function as second param', () => {
    it('we can modify the value before putting it in the array', function() {
      const arr = Array.from(arrayLike, (value) => value.toUpperCase());
      assert.deepEqual(arr, ['ONE', 'TWO']);
    });
    
    it('and we also get the object`s key as second parameter', function() {
      const arr = Array.from(arrayLike, (value, key) => `${key}=${value}`);
      assert.deepEqual(arr, ['0=one', '1=two']);
    });
  });
  
});

// 28: class - super in constructor
// To do: make all tests pass, leave the assert lines unchanged!

describe('class', () => {

  it('if you `extend` a class, use `super()` to call the parent constructor', () => {
    class A {constructor() { this.levels = 1; }}
    class B extends A {
      constructor() {
        super();
        this.levels++;
      }
    }
    
    assert.equal(new B().levels, 2);
  });

  it('`super()` may also take params', () => {
    class A {constructor(startValue=1, addTo=1) { this.counter = startValue + addTo; }}
    class B extends A {
      constructor(...args) { 
        super(...args);
        this.counter++; 
      }
    }
    
    assert.equal(new B(42, 2).counter, 45);
  });
  
  it('it is important where you place your `super()` call!', () => {
    class A {inc() { this.countUp = 1; }}
    class B extends A {
      inc() {
        this.countUp = 2;  
        super.inc();
        return this.countUp;
      }
    }
    
    assert.equal(new B().inc(), 1);
  });

  it('use `super.constructor` to find out if there is a parent constructor', () => {
    class A extends null {
      constructor() {
        super();
        this.isTop = !super.constructor;
      }
    }

    assert.equal(new A().isTop, false);
  });
  
});

27: class - super inside a method
// To do: make all tests pass, leave the assert lines unchanged!

describe('inside a class use `super` to access parent methods', () => {

  it('use of `super` without `extends` fails (already when transpiling)', () => {
    class SuperA {hasSuper() {return false;}}
    class A extends SuperA {hasSuper() { return super.hasSuper(); }}
    
    assert.equal(new A().hasSuper(), false);
  });
  
  it('`super` with `extends` calls the method of the given name of the parent class', () => {
    class A {hasSuper() { return true; }}
    class B extends A {hasSuper() { return super.hasSuper(); }}
    
    assert.equal(new B().hasSuper(), true);
  });
  
  it('when overridden a method does NOT automatically call its super method', () => {
    class A {hasSuper() { return true; }}
    class B extends A {hasSuper() { return void 0; }}
    
    assert.equal(new B().hasSuper(), void 0);
  });
  
  it('`super` works across any number of levels of inheritance', () => {
    class A {iAmSuper() { return this.youAreSuper; }}
    class B extends A {constructor() { super(); this.youAreSuper = true; } }
    class C extends B {
      iAmSuper() { 
        return super.iAmSuper(); 
      }
    }
    
    assert.equal(new C().iAmSuper(), true);
  });
  
  it('accessing an undefined member of the parent class returns `undefined`', () => {
    class A {}
    class B extends A {getMethod() { return super.getParams; }}
    
    assert.equal(new B().getMethod(), void 0);
  });
  
});

// 26: class - more-extends
// To do: make all tests pass, leave the assert lines unchanged!

describe('class can inherit from another', () => {

  it('extend an `old style` "class", a function, still works', () => {
    class A{};
    class B extends A {}
    
    assert.equal(new B() instanceof A, true);
  });
  
  describe('prototypes are as you know them', () => {
    class A {}
    class B extends A {}
    it('A is the prototype of B', () => {
      const isIt = A.isPrototypeOf(B);
      assert.equal(isIt, true);
    });
    it('A`s prototype is also B`s prototype', () => {
      const proto = B.prototype;
      // Remember: don't touch the assert!!! :)
      assert.equal(A.prototype.isPrototypeOf(proto), true);
    });
  });

  describe('`extends` using an expression', () => {
    it('eg the inline assignment of the parent class', () => {
      let A;
      class B extends (A = Function) {}
      
      assert.equal(new B() instanceof A, true);
    });
    
    it('or calling a function that returns the parent class', () => {
      const returnParent = (beNull) => beNull ? null : class {};
      class B extends (returnParent({})) {}
      
      assert.equal(Object.getPrototypeOf(B.prototype), null);
    });
  });
  
});



// 25: class - extends
// To do: make all tests pass, leave the assert lines unchanged!

describe('classes can inherit from another', () => {

  describe('the default super class is Object', () => {
  
    it('class A is an instance of Object', () => {
      class A {};
      
      assert.equal(new A() instanceof Object, true);
    });
  
    it('B extends A, B is also instance of Object', () => {
      class A {}
      class B extends A{}
      
      assert.equal(new B() instanceof A, true);
      assert.equal(new B() instanceof Object, true);
    });
    
    it('class can extend `null`, not an instance of Object', () => {
      class NullClass extends null {}
      
      let nullInstance = new NullClass();
      assert.equal(nullInstance instanceof Object, false);
    });
    
  });
  
  describe('instance of', () => {
    it('when B inherits from A, `new B()` is also an instance of A', () => {
      class A {};
      class B extends A {}
      
      assert.equal(new B() instanceof A, true);
    });
    
    it('extend over multiple levels', () => {
      class A {}
      class B extends A {}
      class C extends B {}
      
      let instance = new C();
      assert.equal(instance instanceof A, true);
    });
  });
});


// 24: class - static keyword
// To do: make all tests pass, leave the assert lines unchanged!

describe('inside a class you can use the `static` keyword', () => {

  describe('for methods', () => {
    
    class IntegrationTest {}
    class UnitTest {}
    
    it('a static method just has the prefix `static`', () => {
      class TestFactory {
        static makeTest() { return new UnitTest(); }
      }
      
      assert.ok(TestFactory.makeTest() instanceof UnitTest);
    });
  
    it('the method name can be dynamic/computed at runtime', () => {
      const methodName = 'createTest';
      class TestFactory {
        static [methodName]() { return new UnitTest(); }
      }
      
      assert.ok(TestFactory.createTest() instanceof UnitTest);
    });
  });
  
  describe('for accessors', () => {
    it('a getter name can be static, just prefix it with `static`', () => {
      class UnitTest {
        static get testType() { return 'unit'; }
      }
      
      assert.equal(UnitTest.testType, 'unit');
    });
    
    it('even a static getter name can be dynamic/computed at runtime', () => {
      const type = 'test' + 'Type';
      class IntegrationTest {
        static get [type]() { return 'integration'; }
      }
      
      assert.ok('testType' in IntegrationTest);
      assert.equal(IntegrationTest.testType, 'integration');
    });
  });
  
});


// 23: class - accessors
// To do: make all tests pass, leave the assert lines unchanged!

describe('class accessors (getter and setter)', () => {

  it('only a getter is defined like a method prefixed with `get`', () => {
    class MyAccount {
      get balance() { return Infinity; }
    }
    
    assert.equal(new MyAccount().balance, Infinity);
  });

  it('a setter has the prefix `set`', () => {
    class MyAccount {
      get balance() { return this.amount; }
      set balance(amount) { this.amount = amount; }
    }
    
    const account = new MyAccount();
    account.balance = 23;
    assert.equal(account.balance, 23);
  });
  
  describe('dynamic accessors', () => {
    
    it('a dynamic getter name is enclosed in [ and ]', function() {
      const balance = 'yourMoney';
      class YourAccount {
        get [balance]() { return -Infinity; }
      }
      
      assert.equal(new YourAccount().yourMoney, -Infinity);
    });
    
    it('a dynamic setter name as well', function() {
      const propertyName = 'balance';
      class MyAccount {
        get [propertyName]() { return this.amount; }
        set [propertyName](amount) { this.amount = 23; }
      }
      
      const account = new MyAccount();
      account.balance = 42;
      assert.equal(account.balance, 23);
    });
  });
  
});


// 22: class - creation
// To do: make all tests pass, leave the assert lines unchanged!

describe('class creation', () => {

  it('is as simple as `class XXX {}`', function() {
    class TestClass {};
    
    const instance = new TestClass();
    assert.equal(typeof instance, 'object');
  });

  it('class is block scoped', () => {
    {class Inside {}}
    assert.equal(typeof Inside, 'undefined');
  });
  
  it('special method is `constructor`', function() {
    class User {
      constructor(id) {
        this.id = id;
      }
    }
    
    const user = new User(42);
    assert.equal(user.id, 42);
  });

  it('defining a method is simple', function() {
    class User {
      writesTests() {
        return false;
      }
    }
    
    const notATester = new User();
    assert.equal(notATester.writesTests(), false);
  });

  it('multiple methods need no commas (opposed to object notation)', function() {
    class User {
      constructor() {
        this.everWroteATest = false;        
      }
      wroteATest() { this.everWroteATest = true; }
      isLazy() { return !this.everWroteATest; }
    }
    
    const tester = new User();
    assert.equal(tester.isLazy(), true);
    tester.wroteATest();
    assert.equal(tester.isLazy(), false);
  });

  it('anonymous class', () => {
    const classType = typeof class {};
    assert.equal(classType, 'function');
  });

});


// 21: spread - with-strings
// To do: make all tests pass, leave the assert lines unchanged!

describe('spread with strings', () => {

  it('simply spread each char of a string', function() {
    const [a, b] = [...'ab'];
    assert.equal(a, 'a');
    assert.equal(b, 'b');
  });

  it('extracts each array item', function() {
    const [a, b] = [...'12'];
    assert.equal(a, 1);
    assert.equal(b, 2);
  });
  
  it('works anywhere inside an array (must not be last)', function() {
    const letters = ['a', ...'bcd', 'e', 'f'];
    assert.equal(letters.length, 6);
  });
  
  it('dont confuse with the rest operator', function() {
    const [...rest] = [...'12345'];
    assert.deepEqual(rest, [1, 2, 3, 4, 5]);
  });
  
  it('passed as function parameter', function() {
    const max = Math.max(...'12345');
    assert.deepEqual(max, 5);
  });
  
});


// 20: spread - with-arrays
// To do: make all tests pass, leave the assert lines unchanged!

describe('spread with arrays', () => {

  it('extracts each array item', function() {
    const [a, b] = [...[1, 2]];
    assert.equal(a, 1);
    assert.equal(b, 2);
  });

  it('in combination with rest', function() {
    const [, a, b, ...rest] = [...[0, 1, 2, 3, 4, 5]];
    assert.equal(a, 1);
    assert.equal(b, 2);
    assert.deepEqual(rest, [3, 4, 5]);
  });

  it('spreading into the rest', function() {
    const [...rest] = [...[1, 2, 3, 4, 5]];
    assert.deepEqual(rest, [1, 2, 3, 4, 5]);
  });

  describe('used as function parameter', () => {
    it('prefix with `...` to spread as function params', function() {
      const magicNumbers = [1, 2];
      const fn = (magicA, magicB) => {
        assert.deepEqual(magicNumbers[0], magicA);
        assert.deepEqual(magicNumbers[1], magicB);
      };
      fn(...magicNumbers);
    });
  
    it('pass an array of numbers to Math.max()', function() {
      const max = Math.max(...[23, 0, 42]);
      assert.equal(max, 42);
    });
  });  
});


// 19: rest - with-destructuring
// To do: make all tests pass, leave the assert lines unchanged!

describe('rest with destrcturing', () => {
    
  it('rest parameter must be last', () => {
    const [...all] = [1, 2, 3, 4];
    assert.deepEqual(all, [1, 2, 3, 4]);
  });
  
  it('assign rest of an array to a variable', () => {
    const [,...all] = [1, 2, 3, 4];
    assert.deepEqual(all, [2, 3, 4]);
  });
  
  // the following are actually using `spread` ... oops, to be fixed
  it('concat differently', () => {
    const theEnd = [3, 4];
    const allInOne = [1, 2, ...theEnd];
    assert.deepEqual(allInOne, [1, 2, 3, 4]);
  });
  
  it('`apply` made simple, even for constructors', () => {
    const theDate = [2015, 1, 1];
    const date = new Date(...theDate);
    assert.deepEqual(new Date(2015, 1, 1), date);
  });
  
});


// 18: rest - as-parameter
// To do: make all tests pass, leave the assert lines unchanged!

describe('rest in function params', () => {
    
  it('must be the last parameter', () => {
    const fn = (veryLast, ...rest) => {
      assert.deepEqual([1, 2], rest);
    };
    fn(0, 1, 2);
  });
  
  it('can be used to get all other parameters', () => {
    const fn = (firstParam, secondParam, ...rest) => {
      assert.deepEqual([3,4], rest);
    };
    fn(null, 2, 3, 4);
  });
  
  it('makes `arguments` obsolete', () => {
    let args = [42, 'twenty three', 'win']; 
    const fn = () => {
      assert.deepEqual([42, 'twenty three', 'win'], args);
    };
    fn(...args);
  });
    
  it('eliminate `arguments`!!!', () => {
    const fn = (...rest) => rest;
    const [firstArg, ...rest] = fn(1, 2, 3);
    assert.deepEqual([2, 3], rest);
  });
    
});



// 17: unicode - in strings
// To do: make all tests pass, leave the assert lines unchanged!

describe('unicode strings', () => {

  it('are \\u prefixed', () => {
    const nuclear = '\u2622';
    assert.equal(nuclear, '☢');
  });

  it('value is 4 bytes/digits', () => {
    const nuclear = '\u2622';
    assert.equal(`no more ${nuclear}`, 'no more ☢');
  });

  it('value is hexadecimal', () => {
    const nuclear = `no more \u2622`;
    assert.equal(nuclear, 'no more ☢');
  });

  it('curly braces may surround the value', () => {
    const nuclear = `\u{0000000006E}\u{00006F} more \u2622`;
    assert.equal(nuclear, 'no more ☢');
  });

});


// 16: object-literal - computed properties
// To do: make all tests pass, leave the assert lines unchanged!

describe('object literal properties may be computed values', () => {

  it('dynamic property `x`', () => {
    const propertyName = 'x';
    const obj = {[propertyName]: 1};
    assert.equal(obj.x, 1);
  });

  it('computed property `x` as a function', () => {
    const key = 'func';
    const obj = {[key](){ return 'seven'}};
    assert.equal(obj.func(), 'seven');
  });

  it('computed property name results from a function call', () => {
    const getName = () => 'propertyName';
    const obj = {[getName()]() {return 'seven'}};
    assert.equal(obj.propertyName(), 'seven');
  });

  it('an expression makes up the property name', () => {
    const what = 'Name';
    const obj = {['property' + what]: null};
    assert.equal('propertyName' in obj, true);
  });

  it('accessor keys can be computed names too', () => {
    const obj = {
      get ['key']() {return 1},
    };
    assert.equal(obj.key, 1);
  });
});


// 15: destructuring - rename
// To do: make all tests pass, leave the assert lines unchanged!

describe('rename variables while destructuring', () => {

  it('rename object key', () => {
    const {x: y} = {x: 1};
    assert.equal(y, 1);
  });
  
  it('object key rename with default value', () => {
    const {x: y=42} = {y: 23};
    assert.equal(y, 42);
  });
  
  it('rename param in a function param', () => {
    const fn = ({x:y}) => {
      assert.equal(y, 1);
    };
    fn({x: 1});
  });
  
  it('rename param in a function param with default value', () => {
    const fn = ({x: y=3}) => {
      assert.equal(y, 3);
    };
    fn({});
  });
  
});


// 14: destructuring - parameters
// To do: make all tests pass, leave the assert lines unchanged!

describe('destructuring function parameters', () => {

  describe('destruct parameters', () => {
    it('multiple params from object', () => {
      const fn = ({id, name}) => {
        assert.equal(id, 42);
        assert.equal(name, 'Wolfram');
      };
      const user = {name: 'Wolfram', id: 42};
      fn(user);
    });
    
    it('multiple params from array/object', () => {
      const fn = ([,{name}]) => {
        assert.equal(name, 'Alice');
      };
      const users = [{name: 'nobody'}, {name: 'Alice', id: 42}];
      fn(users);
    });
  });

  describe('default values', () => {
    it('for simple values', () => {
      const fn = (id, name='Bobby') => {
        assert.strictEqual(id, 23);
        assert.strictEqual(name, 'Bob');
      };
      fn(23, "Bob");
    });
    
    it('for a missing array value', () => {
      const defaultUser = {id: 23, name: 'Joe'};
      const fn = ([user=defaultUser]) => {
        assert.deepEqual(user, defaultUser);
      };
      fn([]);
    });
    
    it('mix of parameter types', () => {
      const fn = (id, [arr], {obj}) => {
        assert.equal(id, 1);
        assert.equal(arr, 2);
        assert.equal(obj, 3);
      };
      let array = [2];
      let obj1 = {obj:3};
      fn(1, array, obj1);
    });
  });

});


// 13: destructuring - defaults
// To do: make all tests pass, leave the assert lines unchanged!

describe('destructuring can also have default values', () => {

  it('for an empty array', () => {
    const [a=1] = [];
    assert.equal(a, 1);
  });

  it('for a missing value', () => {
    const [a,b=2,c] = [1,,3];
    assert.equal(b, 2);
  });

  it('in an object', () => {
    const {a, b=2} = {a: 1};
    assert.equal(b, 2);
  });

  it('if the value is undefined', () => {
    const {a, b=2} = {a: 1, b: void 0};
    assert.strictEqual(b, 2);
  });

  it('also a string works with defaults', () => {
    const [a,b=2] = '12';
    assert.equal(a, '1');
    assert.equal(b, 2);
  });

});


// 12: destructuring - object
// To do: make all tests pass, leave the assert lines unchanged!

describe('destructuring objects', () => {

  it('is simple', () => {
    const {x} = {x: 1};
    assert.equal(x, 1);
  });

  describe('nested', () => {
    it('multiple objects', () => {
      const magic = {first: 23, second: 42};
      const {magic: {second}} = {magic};
      assert.equal(second, 42);
    });
    it('object and array', () => {
      const {z:[,x]} = {z: [23, 42]};
      assert.equal(x, 42);
    });
    it('array and object', () => {
      const [,[{lang}]] = [null, [{env: 'browser', lang: 'ES6'}]];
      assert.equal(lang, 'ES6');
    });
  });
  
  describe('interesting', () => {
    it('missing refs become undefined', () => {
      const {z} = {x: 1, y: 2};
      assert.equal(z, void 0);
    });
  
    it('destructure from builtins (string)', () => {
      const {substr} = "1";
      assert.equal(substr, String.prototype.substr);
    });
  });

});


// 11: destructuring - string
// To do: make all tests pass, leave the assert lines unchanged!

describe('destructuring also works on strings', () => {

  
  it('destructure every character', () => {
    let [a, b, c] = 'abc';
    assert.deepEqual([a, b, c], ['a', 'b', 'c']);
  });
  
  it('missing characters are undefined', () => {
    const [a, b, c] = 'ab';
    assert.equal(c, void 0);
  });
  
  it('unicode character work too', () => {
    const [space, coffee] = 'a \u2615';
    assert.equal(coffee, '\u{2615}');
  });
  
});


// 10: destructuring - array
// To do: make all tests pass, leave the assert lines unchanged!

describe('destructuring arrays makes shorter code', () => {

  it('extract value from array, e.g. extract 0 into x like so `let [x] = [0];`', () => {
    let [firstValue] = [1];
    assert.strictEqual(firstValue, 1);
  });

  it('swap two variables, in one operation', () => {
    let [x, y] = ['ax', 'why'];
    [x, y] = [y, x];
    assert.deepEqual([x, y], ['why', 'ax']);
  });
  
  it('leading commas', () => {
    const all = ['ax', 'why', 'zet'];
    const [,,z] = all;
    assert.equal(z, 'zet');
  });
  
  it('extract from nested arrays', () => {
    const user = [['Some', 'One'], 23];
    const [[firstName, surname], age] = user;
    
    const expected = 'Some One = 23 years';
    assert.equal(`${firstName} ${surname} = ${age} years`, expected);
  });

  it('chained assignments', () => {
    let c, d;
    let [a, b] = [c, d] = [1, 2];
    assert.deepEqual([a, b, c, d], [1, 2, 1, 2]);
  });

  it('in for-of loop', () => {
    for (var [c, a, b] of [[0, 1, 2]]) {}
    assert.deepEqual([a, b], [1, 2]);
  });

});

