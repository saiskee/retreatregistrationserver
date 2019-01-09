SAI Retreat Registration Application
===
*A web-app style registration system, integrated across browsers*

----
To run the registration system locally:
1. Create a MongoDB instance, replacing the ```mongouri``` in ```server.js``` with the correct uri
2. Replace ```port (server.js)``` with whichever port you would like to use (default port: 8080)
3. Run ```node server.js``` from command prompt (node must be installed)
4. Access application through web browser ```localhost:8080```

The following section will address the two main models of data used in this application

## The Registree Model
---
Registrees have the following properties:
* ```mainregistreeid```: ```String``` *This keeps track of the 'parent' registree id of the current registree*
* ```mainregistree``` : ```String```  *This keeps track of the name of the 'parent registree*
* ```name```:  ```String``` *The name of the current registree*
* ``` address```:  ```String``` *The address of the current registree*
* ```formsubmittime```: ```String``` *The time the registree's form was submitted*
*  ```email```:  ```String``` *The registree's email*
*   ```gender```: ```String```
*   ```phone```: ```String``` *The registree's phone number*
*   ```centername```:```String``` *The name of the registree's center*
*    ```ssegroup```:  ```String``` *SSE group of registree, may be blank*
*  ```age```:  ```Number```
*   ```durationofstay```: ```Object``` *How long the registree will be staying*
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; default:{'friday':false,'saturday':false,'sunday':false}},
* ```ya```:  ```Boolean``` *True if registree is a YA (Young Adult)*
*   ```newcomer```: ```Boolean``` *True if this is first retreat for registree*
*   ```accommodation```:```Boolean``` *True if registree will be needing housing accommodation*
* ```bhajanlist```: ```String``` *List of bhajans the registree wants to sing*
* ```dietaryrestrictions```:  ```String``` *Any dietary restrictions the registree may have*
* ```specialaccommodations```:  ```String``` *Elderly, Infant, etc.*
* ```checkintime```: ```String``` *Date/Time when registree checked in*
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;default: Not Checked In
* ```checkouttime``` : ```String``` *Date/Time when registree checked out*
* ```paid```: ```Boolean``` *Whether the registree has paid*
* ```amountpaid```: ```Number``` *Amount that registree has paid*
* ```room```: ```Object``` *contains the data of the room that the registree is staying in*
* ```_id```: ```String``` *The unique Database identifier (DBID) of the registree*


## The Room Model
---
Rooms have the following properties:
* ```roomnumber```: ```String``` 
* ```floornumber``` : ```String```  
* ```building```:  ```String``` *The room's building name*
* ``` handicap```:  ```Boolean``` *Whether the room is handicap accessible*
* ```beds```: ```Number``` *The number of beds in the room*
*  ```maxoccupancy```:  ```Number``` *The room's max occupancy*
*   ```occupants```: ```String``` *The current number of occupants*
*   ```additionalnotes```: ```String``` *Any additional notes about the room*
* ```_id```: ```String``` *The unique Database identifier (DBID) of the registree*

## Updating A Model
---
When adding or deleting a property from a Model, a few other places must be updated. Replace ```Model``` with which ever model you are working with (Registree, Room, etc.) and propertyname with whichever property you are updating (mainregistree, registree, roomnumber,etc.):
1. **(server.js)**: ```Model = mongoose.model('Model', mongoose.Schema({...})```
2. **(server.js)**:  ```getReqParamsModel = function(req){...}```
     * simply add the new property as ```propertyname: req.body.propertyname```
3. **(public/scripts/thapp.js)** ```class Model{ constructor(){...} }```
    * add ```this.propertyname```
4. **(public/...)** Make sure to update any forms that you need to show/update this property on