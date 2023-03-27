let columnContent;
let content;
let taskContent;

class Trello {
    constructor(container) {
        this.container = container;
        this.data = this.getLocalData() || [];
        this.dataTimeStamp = localStorage.getItem("columnsTimeStamp") || 0;
        this.render();   
        this.webSocketInit(() => {
            this.webSocketSend(this.dataTimeStamp);
        });
    }

    htmlBuilder(type, className, parent, identificId) {
        let variable = document.createElement(type);
        variable.classList.add(className);
        parent?.append(variable);
        if(identificId) variable.identificId = identificId;
        return variable;
    }
    
    addToData(identificId, item, value) {
        this.data.find(elem => elem.identificId === identificId)[item] = value;
    }

    changeDataSplice(data, ind, quanity, item) {
        data.splice(ind, quanity, item);
    }

    drawColumn(dataTitle, identificId) {  
        columnContent = this.htmlBuilder("div", "column-content", this.addColumnButton, identificId)
        
        content = this.htmlBuilder("div", "content", columnContent);
        
        let columnTitleContent = this.htmlBuilder("div", "column-title-content", content);

        let columnTitle = this.htmlBuilder("input", "column-title", columnTitleContent, identificId);
        columnTitle.maxLength = 50;
        columnTitle.value = dataTitle;

        let deleteColumnButton = this.htmlBuilder("button", "column-delete-button", columnTitleContent, identificId);

        columnTitle.onclick = (evt) => {
            evt.stopPropagation();
            evt.preventDefault();
        }

        columnTitle.addEventListener("focusout", () => {
            let value = columnTitle.value.trim();
            if(columnTitle.value.trim() === '') {
                value = dataTitle;
                columnTitle.value = value.trim();
            }
            this.addToData(identificId, "title", columnTitle.value);
            this.setLocalData();
        })

        columnTitle.addEventListener("keypress", evt => {
            evt.stopPropagation();
            if(evt.keyCode === 13) {
                columnTitle.value = columnTitle.value.trim();
                columnTitleContent.innerHTML = "";
                columnTitleContent.append(columnTitle)
                columnTitleContent.append(deleteColumnButton);
                
                if(columnTitle.value === '') {
                    columnTitle.value = columnTitle.value.trim();
                }
                this.addToData(identificId, "title", columnTitle.value);
                this.setLocalData();
            }
        })
        
        taskContent = this.htmlBuilder("div", "column__task-content", content, identificId);
        
        deleteColumnButton.onclick = (evt) => {
                evt.stopPropagation();
                
                let ind = this.data.findIndex(elem => elem.identificId === deleteColumnButton.identificId)

                this.data.splice(ind,1);
                this.setLocalData();
                this.container.innerHTML = "";
                this.render();
            }
        
        this.dragDropColumns();
    }

    drawTaskContent(cnt, identificId) {   
        this.taskClmnCntsArr = [];
        let clmnCntArr = [... this.container.querySelectorAll(".column-content")];
        
        let addTaskButton = this.htmlBuilder("button", "button-add-task", cnt, identificId);
        addTaskButton.innerHTML = "+ Add a task";
        
        this.container.querySelectorAll(".column__task-content").forEach(taskCnt => {
            this.taskClmnCntsArr.push(taskCnt);

            this.container.querySelectorAll(".button-add-task").forEach((item) => { 
                item.onclick = (evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    item.remove();

                    let ind = this.taskClmnCntsArr.findIndex(elem => elem.identificId === item.identificId);

                    let titleTextArea = this.htmlBuilder("textarea", "task-content__textarea", clmnCntArr[ind]);
                    titleTextArea.placeholder = "Enter task title";
                    titleTextArea.maxLength = 100;
                    titleTextArea.focus();
                    
                    titleTextArea.onclick = (evt) => {
                        evt.stopPropagation();
                        evt.preventDefault();
                    }

                    titleTextArea.addEventListener('keypress', evt => {
                        if(evt.shiftKey && evt.keyCode === 13) {
                            let taskidentificId = 'identificId_' + Math.random(1, 1000);
                            if(titleTextArea.value.trim() !== '') {   
                                evt.stopPropagation();
                                clmnCntArr[ind].removeChild(titleTextArea);
                                clmnCntArr[ind].removeChild(taskTitleControls);
                                
                                this.data[ind].tasks.push({title:titleTextArea.value, description:'', identificId: taskidentificId});

                                this.setLocalData();

                                this.drawTask(titleTextArea.value, this.taskClmnCntsArr[ind], this.taskClmnCntsArr[ind].identificId);
                                this.dragDropTask();

                                clmnCntArr[ind].append(item);
                            }
                        }
                    })

                    let taskTitleControls = this.htmlBuilder("div", "column__title-controls", clmnCntArr[ind]);
            
                    let addTaskTitle = this.htmlBuilder("button", "button-add-title", taskTitleControls);
                    addTaskTitle.innerHTML = "Add task";
            
                    let closeTaskButton = this.htmlBuilder("button", "close-button", taskTitleControls);
                    closeTaskButton.innerHTML = "x";

                    addTaskTitle.onclick = (evt) => {   
                        evt.preventDefault()
                        let taskidentificId = 'identificId_' + Math.random(1, 1000);
                        if(titleTextArea.value.trim() !== '') {   
                            evt.stopPropagation();
                            clmnCntArr[ind].removeChild(titleTextArea);
                            clmnCntArr[ind].removeChild(taskTitleControls);
                            this.data[ind].tasks.push({title:titleTextArea.value, description:'', identificId: taskidentificId});

                            this.setLocalData();

                            this.drawTask(titleTextArea.value, this.taskClmnCntsArr[ind], this.taskClmnCntsArr[ind].identificId);
                            this.dragDropTask();

                            clmnCntArr[ind].append(item);
                        }
                    }
                    
                    closeTaskButton.onclick = (evt) => {  
                        evt.stopPropagation();
                        clmnCntArr[ind].removeChild(titleTextArea);
                        clmnCntArr[ind].removeChild(taskTitleControls);
                        clmnCntArr[ind].append(item);
                    }
                                            
                }
            })

        })
        
    }

    drawTask(taskDesctitle, content, identificId) {
        let delTaskBtnArr = [];
        let taskContentTitle = this.htmlBuilder("div", "task-content-title", content, identificId);
                       
        let taskTitle = this.htmlBuilder("div", "task-title", taskContentTitle);
                    
        let title = this.htmlBuilder("p", "title", taskTitle);
        title.innerHTML = taskDesctitle;
         
        let deleteTaskButton = this.htmlBuilder("button", "delete-task-button", taskTitle, identificId);
        
        this.taskDescriptionContentLogo = this.htmlBuilder("div", "task-description-content-logo", taskContentTitle);

        this.container.querySelectorAll(".delete-task-button").forEach(item => {
            delTaskBtnArr.push(item);
                item.onclick = (evt) => {
                    evt.stopPropagation();
                    
                    let delTaskBtnFilterArr = delTaskBtnArr.filter(elem => elem.identificId === item.identificId);
                    let ind = this.taskClmnCntsArr.findIndex(elem => elem.identificId === item.identificId);
                    this.data[ind].tasks.splice(delTaskBtnFilterArr.indexOf(item), 1);
                    
                    this.setLocalData();
                    this.containerBoard.innerHTML = "";
                    this.drawContent();
                    this.drawContainerBoard("button-add-column", "+ Add a column");
                }
        });

        this.drawModalWindow(); 
    }
    
    drawModalWindow() {
        let taskTitleArr = [];
        let modalDescriptionContent;
        let modalDescriptionTextAreaContent;
        let modalDescription;
        let modalDescriptionTextArea;

        this.container.querySelectorAll(".task-content-title").forEach((elem) => {
            taskTitleArr.push(elem)
            elem.onclick = (evt) => {
                evt.stopPropagation()
                let taskTitleFilterArr = taskTitleArr.filter(item => item.identificId === elem.identificId); 
                
                let taskClmnCntInd = this.taskClmnCntsArr.findIndex(item => item.identificId === elem.identificId);
                let ind = taskTitleFilterArr.indexOf(elem);

                let taskContentOverlay = document.querySelector(".task-content__overlay-window");
                let taskContentModal = document.querySelector(".task-content__modal");
                
                taskContentOverlay.classList.add("task-content__overlay-window_visible");
                
                let modalHeader = this.htmlBuilder("div", "modal-header", taskContentModal);

                let columnTitleInfo = this.htmlBuilder("span", "column-title-info", taskContentModal);
                columnTitleInfo.innerHTML = `in column ${this.data[taskClmnCntInd].title}`;
                
                let taskContentModalTitle = this.htmlBuilder("p", "modal-title", modalHeader);
                taskContentModalTitle.innerHTML = this.data[taskClmnCntInd].tasks[ind].title;
                
                let taskContentModalTitleTextArea = this.htmlBuilder("textarea", "modal-task-title-text-area");
                taskContentModalTitleTextArea.maxLength = 100;
                
                let modalCloseButton = this.htmlBuilder("button", "modal-close-button"); 

                taskContentModalTitle.onclick = (evt) => {
                    evt.stopPropagation();
                    modalHeader.removeChild(taskContentModalTitle);
                    modalHeader.append(taskContentModalTitleTextArea);

                    taskContentModalTitleTextArea.value = this.data[taskClmnCntInd].tasks?.[ind]?.title;
                    taskContentModalTitleTextArea.select();

                    modalHeader.append(modalCloseButton);
                    taskContentModalTitleTextArea.addEventListener("keypress", evt => {
                        if(evt.keyCode === 13) {
                            if(taskContentModalTitleTextArea.value.trim() !== '') {
                                taskContentModalTitle.value = taskContentModalTitleTextArea.value;
                                modalHeader.innerHTML = "";
                                
                                taskContentModalTitleTextArea.remove();
                                modalHeader.append(taskContentModalTitle);
                                modalHeader.append(modalCloseButton);
                                
                                this.data[taskClmnCntInd].tasks[ind].title = taskContentModalTitleTextArea.value;
                                taskContentModalTitle.innerHTML = this.data[taskClmnCntInd].tasks[ind].title;

                                this.setLocalData();
                            }
                        } 
                    })
                }
                
                modalHeader.append(modalCloseButton);

                modalDescriptionContent = this.htmlBuilder("div", "modal-description-content", taskContentModal);

                let modalDescriptionText = this.htmlBuilder("div", "description-text", modalDescriptionContent);
                
                let text = this.htmlBuilder("p", "text", modalDescriptionText);
                text.innerHTML = "Description";

                modalDescriptionTextAreaContent = this.htmlBuilder("div", "modal-description-text-area-content", modalDescriptionContent);
                
                let modalDescriptionControls = this.htmlBuilder("div", "modal-description__controls");

                let addDescriptionButton = this.htmlBuilder("button", "button-add-description");
                addDescriptionButton.innerHTML = "Save";         

                let closeDescriptionButton = this.htmlBuilder("button", "modal-description-close-button");
                closeDescriptionButton.innerHTML = "Cancel";

                modalDescription = this.htmlBuilder("p", "modal-description");
                modalDescription.textContent = "task description . . .";
                
                modalDescriptionTextArea = this.htmlBuilder("textarea", "modal-description-text-area");
                modalDescriptionTextArea.placeholder = "Add a more detailed description ...";
                modalDescriptionTextArea.maxLength = 600;
                
                let value;

                addDescriptionButton.onclick = () => {
                    modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                    modalDescriptionContent.append(modalDescription);

                    if(modalDescriptionTextArea.value != "") {
                        modalDescription.textContent = modalDescriptionTextArea.value;
                        this.data[taskClmnCntInd].tasks[ind].description = modalDescription.textContent;
                    } else {
                        modalDescription.textContent = "task description . . .";
                        this.data[taskClmnCntInd].tasks[ind].description = "";
                    }
                    this.setLocalData();
                }

                closeDescriptionButton.onclick = () => {
                    modalDescriptionTextAreaContent.remove();
                    modalDescriptionContent.append(modalDescription);

                    if(modalDescriptionTextArea.value) {
                        if(this.data[taskClmnCntInd].tasks[ind].description == '') { 
                            value = modalDescription.textContent;
                        }
                    } else {                            
                        if(this.data[taskClmnCntInd].tasks[ind].description != "") {
                            value = this.data[taskClmnCntInd].tasks[ind].description;
                        }
                    }
                    
                    if(value){
                        modalDescriptionTextArea.value = value;
                    }

                    this.setLocalData();
                } 

                modalDescription.onclick = () => { 
                    modalDescriptionContent.removeChild(modalDescription);
                    modalDescriptionContent.append(modalDescriptionTextAreaContent);
                    modalDescription.remove();
                    modalDescriptionContent.append(modalDescriptionTextAreaContent);

                    if(this.data[taskClmnCntInd].tasks[ind].description != "") {
                        modalDescriptionTextAreaContent.append(modalDescriptionTextArea);
                        modalDescriptionTextAreaContent.append(modalDescriptionControls);
                        modalDescriptionControls.append(addDescriptionButton);
                        modalDescriptionControls.append(closeDescriptionButton);
                        modalDescriptionTextArea.placeholder = "task description . . .";
                    }

                    modalDescriptionTextArea.value = this.data[taskClmnCntInd].tasks[ind].description;
                    modalDescriptionTextArea.select();

                    this.setLocalData();
                }

                if(this.data[taskClmnCntInd].tasks[ind].description === "") {
                    modalDescriptionTextAreaContent.append(modalDescriptionTextArea);
                    modalDescriptionTextArea.value = "";
                    modalDescriptionTextAreaContent.append(modalDescriptionControls);
                    modalDescriptionControls.append(addDescriptionButton);
                    modalDescriptionControls.append(closeDescriptionButton);
                } else {
                    modalDescriptionContent.append(modalDescription);

                    modalDescription.textContent = this.data[taskClmnCntInd].tasks[ind].description;
                }
                
                modalCloseButton.onclick = () => {
                    taskContentOverlay.classList.add("task-content__overlay-window");
                    taskContentOverlay.classList.remove("task-content__overlay-window_visible");
                    taskContentModal.removeChild(modalHeader);
                    taskContentModal.removeChild(modalDescriptionContent);
                    taskContentModal.removeChild(columnTitleInfo)
                    this.containerBoard.innerHTML = "";
                    this.setLocalData();

                    this.drawContent();
                    this.drawContainerBoard("button-add-column", "+ Add a column");
                } 
            }
         })
    }

    drawContainerBoard(className, innerHTML, elIdentificId) {
        this.addColumnButton = this.htmlBuilder("div", className, this.containerBoard, elIdentificId);
        this.addColumnButton.innerHTML = innerHTML;
        this.addColumnButton.identificId = elIdentificId;
        this.buttonClicked = true;
        this.xCoordinatesArr = [];
  
        this.container.querySelectorAll(".button-add-column").forEach(button => {
            button.onclick = (evt) => {
                evt.stopPropagation();
                if(button.buttonClicked != true && button.innerHTML === "+ Add a column") {
                    evt.stopPropagation();
                    button.innerHTML = "";
                    button.classList.remove("button-add-column");
                    button.classList.add('column')
                    evt.stopPropagation();
    
                    let titleInput = this.htmlBuilder("input", "title-input", button); 
                    titleInput.placeholder = "Enter column title";
                    titleInput.maxLength = 50;
                    titleInput.focus();
                    titleInput.onclick = (evt) => {
                        evt.stopPropagation();
                    }
    
                    let columnTitleControls = this.htmlBuilder("div", "column__title-controls", button); 
    
                    let addColumnTitle = this.htmlBuilder("button", "button-add-title", columnTitleControls); 
                    addColumnTitle.innerHTML = "Add column";
                    
                    addColumnTitle.onclick = (evt) => {
                        evt.stopPropagation();
                        if(titleInput.value.trim() !== '') {   
                            let identificId = 'identificId_' + Math.random(1, 1000);
    
                            button.identificId = identificId;
                            this.column = {};
                            this.column.identificId = identificId;
                            button.innerHTML = "";
                            this.column.title = titleInput.value.trim();
                            this.column.draggable = "deactivate";
                            this.column.tasks = [];
                            this.data.push(this.column);
                            button.innerHTML = "";
                            this.setLocalData();

                            this.drawColumn(this.column.title, this.column.identificId);
                            this.drawTaskContent(columnContent, identificId);
                            this.drawContainerBoard("button-add-column", "+ Add a column");
                            this.dragDropTask();
                        }
                    }
    
                    let closeColumnButton = this.htmlBuilder("button", "close-button", columnTitleControls);
                    closeColumnButton.innerHTML = "x";
    
                    closeColumnButton.onclick = (evt) => {
                        evt.stopPropagation();
                        this.addColumnButton.classList.add("button-add-column");
                        button.innerHTML = "+ Add a column";
                        this.buttonClicked = true;
                    }
                    this.buttonClicked = false;
                }
            }
        })
    }

    render() 
    {            
        this.addColumnButton;
        this.localStorageObj = localStorage.getItem("columnsData");
        
        this.containerBoard = this.htmlBuilder("div", "container__board", this.container);

        this?.data?.forEach((el) => {
            let identificId = el.identificId; 
            this.drawContainerBoard("column", "", identificId);

            this.drawColumn(el.title, identificId);
            this.drawtaskDescriptionContentLogo(el);
            this.drawTaskContent(columnContent, identificId);
        })
        
        this.drawContainerBoard("button-add-column", "+ Add a column");
        this.dragDropTask();
                
        window.addEventListener("online", (e) => {
            this.webSocketInit(() => {
                this.webSocketSend(this.dataTimeStamp);
            });
        });
    }

    drawContent() {
        this?.data?.forEach((el) => {
            let identificId = el.identificId; 
            this.drawContainerBoard("column", "", identificId)
            this.drawColumn(el.title, identificId);
            this.drawtaskDescriptionContentLogo(el);
            this.drawTaskContent(columnContent, identificId);
        });
        this.dragDropTask();
    }
    
    drawtaskDescriptionContentLogo(elem) {
        elem.tasks.forEach((task) => {
            this.drawTask(task.title, taskContent, taskContent.identificId);
            if(task.description === "") {
                this.taskDescriptionContentLogo.classList.remove("task-description-content-logo_visible");
                this.taskDescriptionContentLogo.classList.add("task-description-content-logo");
            }
            if(task.description != "") {
                this.taskDescriptionContentLogo.classList.add("task-description-content-logo_visible");
            }
        })
    }
    
    dragDropTask() { 
        var taskTitleArr = [...this.container.querySelectorAll(".task-content-title")];
        var taskTitleFilterArr;
        this.taskDraggedItem = null;
        let self = this;
        let data;
        self.taskYCoordinatesArr = [];
        self.taskYCoordinatesFilterArr = [];
        this.yCoordinate;
        this.mouseYPosition;
        this.taskInd;
        this.task;

        this.container.querySelectorAll(".task-content-title").forEach(item => {
            if(item.getAttribute('dragActivated') == 'true') return;
            item.setAttribute('dragActivated', 'true');
            item.draggable = "true";
            
            item.addEventListener('dragstart', (evt) => {
                evt.stopPropagation();
                this.taskDraggedItem = item;
                if(this.taskDraggedItem) this.taskDraggedItem.drop = false;
                this.mouseYPosition = evt.clientY;

                taskTitleFilterArr = taskTitleArr.filter(elem => elem.identificId === this.taskDraggedItem.identificId);
                this.taskInd = taskTitleFilterArr.indexOf(this.taskDraggedItem);
                this.task = this.data.find(elem => elem.identificId === this.taskDraggedItem.identificId).tasks[this.taskInd];
                this.data.find(elem => elem.identificId === this.taskDraggedItem.identificId).tasks.splice(this.taskInd, 1);
                
                taskTitleFilterArr.forEach(item => {
                    self.taskYCoordinatesArr.push(item.getBoundingClientRect().y);
                })

                this.yCoordinate = self.taskYCoordinatesArr[this.taskInd];
                self.taskYCoordinatesArr.splice(this.taskInd, 1);
                this.setLocalData();
                
                setTimeout(() => {
                    this.taskDraggedItem.classList.add("task-content-title-drag-start");
                },0);

            });

            item.addEventListener('dragend', (evt) => {
                if(this.taskDraggedItem != null && this.taskDraggedItem.drop === false) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.taskDraggedItem.classList.remove("task-content-title-drag-start");
                    this.taskDraggedItem.classList.add("task-content-title");
                    
                    data = this.data.find(elem => elem.identificId === this.taskDraggedItem.identificId).tasks
                    this.changeDataSplice(data, this.taskInd, 0, this.task);
                    this.changeDataSplice(self.columnsXCoordinatesArr, this.taskInd, 0, this.yCoordinate);
                    this.setLocalData();
                }
            })
        })

        this.container.querySelectorAll(".column__task-content").forEach(cnt => {
            if(cnt.getAttribute('dragActivated') == 'true') return;
            
            cnt.setAttribute('dragActivated', 'true');

            cnt.addEventListener('dragover', evt => {
                evt.preventDefault();
            })
            cnt.addEventListener('drop', evt => {
                evt.preventDefault();
                evt.stopPropagation();
                let self = this
                if(cnt.childNodes.length != 0) {
                    if(this.taskDraggedItem != null) {
                        if(this.taskDraggedItem.classList.contains("task-content-title-drag-start") === true) {
                        taskTitleFilterArr = [...cnt.querySelectorAll(".task-content-title")];
                        self.taskYCoordinatesArr = [];
                        taskTitleFilterArr.forEach(item => {
                            self.taskYCoordinatesArr.push(item.getBoundingClientRect().y);
                        })

                        let goal = evt.clientY;
                        var closest = self.taskYCoordinatesArr.reduce(function(prev, curr) {
                            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                        });

                        this.ind = self.taskYCoordinatesArr.indexOf(closest);
                        let index = this.ind;
                        if(this.taskDraggedItem.identificId != cnt.identificId) {
                            if(goal > closest) {
                                index = index + 1;
                                this.setLocalData();
                            }
                        } 

                        else if(this.taskDraggedItem.identificId == cnt.identificId) {
                            if(goal < closest && goal > this.mouseYPosition) {
                                index = index-1;
                            }
                        }
                        data = this.data.find(elem => elem.identificId === cnt.identificId).tasks;
                        this.changeDataSplice(data, index, 0, this.task);
                        this.setLocalData();
                        this.taskDraggedItem.drop = true;

                        this.containerBoard.innerHTML = "";
                        this.setLocalData();

                        this.drawContent();
                        this.drawContainerBoard("button-add-column", "+ Add a column");
                    } else {
                        this.changeDataSplice(this.data, self.clmInd, 0, self.clmn);
                        this.changeDataSplice(self.columnsXCoordinatesArr, self.clmInd, 0, self.clmnXCoordinate);
                        this.setLocalData();
                    }
                }
            } 
            else {
                if(this.taskDraggedItem != null) {
                data = this.data.find(elem => elem.identificId === cnt.identificId).tasks;
                this.changeDataSplice(data, 0, 0, this.task)
                this.setLocalData();
                
                this.taskDraggedItem.drop = true;

                this.container.innerHTML = "";
                this.render();
                }
            }
            })
        })        
    }
    
    dragDropColumns() {
        let draggedItem = null;
        let ind;
        let clmn;
        let self = this;
        self.columnsXCoordinatesArr = [];
        let xCoordinate;
        let mouseXPosition;

        this.container.querySelectorAll(".column").forEach(item => {
            self.columnsXCoordinatesArr.push(item.getBoundingClientRect().x);

            if(item.classList.contains('button-add-column') === true || item.getAttribute('dragActivated') == 'true') {
                return
            }
            
            item.setAttribute('dragActivated', 'true');

            item.draggable = "true";
            
            item.addEventListener('dragstart', (evt) => {
                evt.stopPropagation();
                draggedItem = item;
                mouseXPosition = evt.clientX;

                if(draggedItem != null) draggedItem.drop = false;
                ind = this.data.findIndex(elem => elem.identificId === draggedItem.identificId);

                xCoordinate = self.columnsXCoordinatesArr[ind]
                clmn = this.data[ind];
                this.data.splice(ind,1);
                    
                self.columnsXCoordinatesArr.splice(ind, 1);
                self.clmnXCoordinate = self.columnsXCoordinatesArr[ind];
                self.clmInd = ind;
                self.clmn = clmn;
                this.setLocalData();

                setTimeout(() => {
                    draggedItem.classList.remove("column");
                    draggedItem.classList.add("column-drag-start");
                },0)
            })

            this.containerBoard.addEventListener("dragover", (evt) => {
                evt.preventDefault();
            })

            this.containerBoard.addEventListener('drop', (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                    if(draggedItem != null && draggedItem.classList.contains("column-drag-start") === true) {
                    let goal = evt.clientX;
                    var closest = self.columnsXCoordinatesArr.reduce(function(prev, curr) {
                        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                    });

                    draggedItem.drop = true;
                    
                    let index = self.columnsXCoordinatesArr.indexOf(closest);

                    if(goal <= closest) {
                        index = index;
                    } 
                    else if(goal >= closest) {
                        index = index + 1;
                    }
                    
                    this.changeDataSplice(this.data, index, 0, clmn);
                    this.setLocalData();
                    this.container.innerHTML = "";
                    this.render();
                }            
            })
            
            item.addEventListener('dragend', (evt) => {
                if(draggedItem != null && draggedItem.drop === false) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    draggedItem.classList.remove("column-drag-start");
                    draggedItem.classList.add("column");
                    this.changeDataSplice(this.data, ind, 0, clmn);
                    this.changeDataSplice(self.columnsXCoordinatesArr, ind, 0, xCoordinate);
                    this.setLocalData();
                }
            })
        })

    }

    getLocalData()
    {
        let localData = localStorage.getItem("columnsData") || '[]';
        return JSON.parse(localData);
    }

    setLocalData(timestamp)
    {   
        let localTimeStamp = timestamp || Date.now();
        this.dataTimeStamp = localTimeStamp;
        localStorage.setItem('columnsTimeStamp', localTimeStamp);
        localStorage.setItem('columnsData', JSON.stringify(this.data));

        if(!timestamp) {
            this.webSocketSend(localTimeStamp);
        }
    }
    
    webSocketSend(localTimeStamp)
    {
        if(!navigator.onLine) return;
        this.ws.send(JSON.stringify({sender: 'trello', message: this.data, timestamp: localTimeStamp}));

    }
    
    webSocketInit(callback) {
        if(this?.ws?.readyState == 1) {
            if (typeof callback === 'function') {
                callback();               
            }
            return;
        }

        this.ws = new WebSocket('wss://socketsbay.com/wss/v2/1/demo/');

        this.ws.onclose = () => {
            if(navigator.onLine)  this.webSocketInit();
        }

        this.ws.onopen = () => {
            if (typeof callback === 'function') {
                callback();
            }
        }
                
        this.ws.onmessage = (m) => {
            let receivedData;
            try{
                receivedData = JSON.parse(m.data);
            } catch(ex) {
                console.log(ex);               
            }
           
            if(receivedData?.sender == 'trello') {
                if(receivedData?.timestamp > this.dataTimeStamp) {
                    this.containerBoard.innerHTML = "";    
                    this.data = receivedData.message;
                    this.setLocalData(receivedData?.timestamp);    
                    this.drawContent();
                    this.drawContainerBoard("button-add-column", "+ Add a column");
                } else {
                    return
                }
            }
        }
    }
}

var test = new Trello(document.querySelector(".container"));