# DSS (NOT SAFE FOR PRODUCTION)
Dynamic Style Sheets
for dynamic projects


[![Join the chat at https://gitter.im/guisouza/dss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/guisouza/dss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)





![Alt text](http://i.imgur.com/tPRotMv.png "DSS")

![Alt text](http://im.ezgif.com/tmp/ezgif-655236192.gif "DSS")

***[LIVE DEMO](http://codepen.io/anon/pen/jbrorZ?editors=100 "LIVE DEMO")***


# Dynamic Style Sheets

Dynamic Style Sheets gives you the ability to dynamically set values to your css properties on the go.
No more inline binding.

An DSS example

First things first ...  

```bash
	bower install dss;
```


```html
<!--load the dss-->
<script src="dss.js"></script>
```
then ... 
```html
<!--
link your css
NOTE : use the **dynamic-stylesheet** rel attribute so I can put poison in your css.
-->
<link rel="dynamic-stylesheet" href="style.css">
```
**or**
```html
<!--
NOTE : use the **dynamic-stylesheet** rel attribute so I can put poison in your css.*/
-->
<style type="dynamic-stylesheet">

...
</style>
```
```css
.box{
	width: 50px;
	height: 50px;
	background: ||companyColor:red||;
	position: absolute;
	top: ||mouseY-25||px;
	left: ||mouseX-25||px;
}
```
The **mouseY** and **mouseX** identifiers will automatically receive the mouse position on the screen, every time it changes. 

The **companyColor** identifier must be set over javascript, but until you do, it will receive the default value **red**.

```js
dss.setProperty('companyColor','#1616FF')
```

# Javascript API

**dss.setProperty**
```js	
dss.setProperty('companyColor','#1616FF')
```

**dss.setDynamicProperty**
```js
//will generate mouseX and mouseY property everytime document fires mousemove
dss.setDynamicProperty('mouse',function(){
	return{
		context : document,

		event : 'mousemove',

		getter : function(e){
			return {
				x : e.pageX,
				y : e.pageY,
			};
		}
	};
});
```

# Default Auto-Binded Properties

##### **mouseX**
Automatically receives the x position of the cursor.

##### **mouseY**
Automatically receives the y position of the cursor.

##### **scrollX**
Automatically receives the x position of the window scroll.

##### **scrollY**
Automatically receives the y position of the window scroll.

##### **windowWidth**
Automatically receives the window width.

##### **windowHeight**
Automatically receives the window height.

# Version 
0.0.3 **Alpha**

# Building
```bash
npm install && grunt
```

