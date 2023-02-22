class Trello {
    constructor(container) {
        this.container = container;
        this.data = this.getLocalData() || [];
        this.render();
    }

    drawColumn(title, identificId) {          
        this.columnContent = document.createElement("div");
        this.columnContent.classList.add("column-content");
        this.addColumnButton.append(this.columnContent);
        this.columnContent.identificId = identificId;
            
        this.content = document.createElement("div");
        this.content.classList.add("content");
        this.columnContent.append(this.content)

        let columnTitleContent = document.createElement("div");
        columnTitleContent.classList.add("column-title-content");
        this.content.append(columnTitleContent);

        let columnTitle = document.createElement("input");
        columnTitle.classList.add("column-title");
        columnTitleContent.append(columnTitle);
        columnTitle.identificId = identificId;
        columnTitle.value = title

        columnTitle.onclick = (evt) => {
            evt.stopPropagation();
            evt.preventDefault()
        }
        columnTitle.addEventListener("keypress", evt => {
            evt.stopPropagation();
            if(evt.keyCode === 13) {
                columnTitle.value = columnTitle.value;
                columnTitleContent.innerHTML = "";
                columnTitleContent.append(columnTitle)
                columnTitleContent.append(this.deleteColumnButton);
                this.data.find(elem => elem.identificId === columnTitle.identificId).title = columnTitle.value
                this.setLocalData();
            }
        })
        
        this.deleteColumnButton = document.createElement("button");
        this.deleteColumnButton.classList.add("column-delete-button");
        columnTitleContent.append(this.deleteColumnButton);
        this.deleteColumnButton.identificId = identificId;
        

        this.taskContent = document.createElement("div");
        this.taskContent.classList.add("column__task-content");
        this.content.append(this.taskContent);
        this.taskContent.identificId = identificId
        
        this.container.querySelectorAll(".column-delete-button").forEach(item => {
            item.onclick = (evt) => {
                evt.stopPropagation();
                
                let ind = this.data.findIndex(elem => elem.identificId === item.identificId)

                this.data.splice(ind,1);
                this.containerBoard.innerHTML = "";
                this.setLocalData();

                this.data.forEach(elem => {
                    this.addColumnButton = document.createElement("div");
                    this.addColumnButton.classList.add("column");
                    this.containerBoard.append(this.addColumnButton);
                    this.addColumnButton.identificId = elem.identificId
                    
                    this.drawColumn(elem.title, elem.identificId);
                    
                    this.drawtaskDescriptionContentLogo(elem)

                    this.drawTaskContent(this.columnContent, elem.identificId);
                    this.dragDropTask();

                })
                
                this.drawContainerBoard();
            }
            
        }) 
        this.dragDropColumns();
    }

    
    drawTaskContent(cnt, identificId) {   
        this.taskClmnCntsArr = [];
        let clmnCntArr = [... this.container.querySelectorAll(".column-content")]
        this.addTaskButton = document.createElement("button");
        this.addTaskButton.classList.add("button-add-task");
        this.addTaskButton.innerHTML = "+ add Task";
        cnt.append(this.addTaskButton);
        this.addTaskButton.identificId = identificId;
        
        this.container.querySelectorAll(".column__task-content").forEach(taskCnt => {
            this.taskClmnCntsArr.push(taskCnt)

            this.container.querySelectorAll(".button-add-task").forEach((item) => { 
                item.onclick = (evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    item.remove();

                    let ind = this.taskClmnCntsArr.findIndex(elem => elem.identificId === item.identificId)

                    let titleTextArea = document.createElement("textarea");
                    titleTextArea.classList.add("task-content__textarea");
                    clmnCntArr[ind].append(titleTextArea);
                    titleTextArea.placeholder = "Enter task title";
                    
                    titleTextArea.onclick = (evt) => {
                        evt.stopPropagation();
                    }

                    titleTextArea.addEventListener('keypress', evt => {
                        if(evt.shiftKey && evt.keyCode === 13) {
                            let taskidentificId = 'identificId_' + Math.random(1, 1000);
                        if(titleTextArea.value != "") {   
                            evt.stopPropagation();
                            clmnCntArr[ind].removeChild(titleTextArea);
                            clmnCntArr[ind].removeChild(taskTitleControls);
                            this.data[ind].tasks.push({title:titleTextArea.value, description:'', identificId: taskidentificId});

                            this.setLocalData();

                            this.drawTask(titleTextArea.value, this.taskClmnCntsArr[ind], this.taskClmnCntsArr[ind].identificId);
                            this.dragDropTask()

                            clmnCntArr[ind].append(item);
                        }
                        }
                    })

                    let taskTitleControls = document.createElement("div");
                    taskTitleControls.classList.add("column__title-controls");
                    clmnCntArr[ind].append(taskTitleControls);
            
                    let addTaskTitle = document.createElement("button");
                    addTaskTitle.classList.add("button-add-title");
                    addTaskTitle.innerHTML = "Add task";
                    taskTitleControls.append(addTaskTitle);
            
                    let closeTaskButton = document.createElement("button");
                    closeTaskButton.classList.add("close-button");
                    closeTaskButton.innerHTML = "x";
                    taskTitleControls.append(closeTaskButton);

                    addTaskTitle.onclick = (evt) => {   
                        evt.preventDefault()
                        let taskidentificId = 'identificId_' + Math.random(1, 1000);
                        if(titleTextArea.value != "") {   
                            evt.stopPropagation();
                            clmnCntArr[ind].removeChild(titleTextArea);
                            clmnCntArr[ind].removeChild(taskTitleControls);
                            this.data[ind].tasks.push({title:titleTextArea.value, description:'', identificId: taskidentificId});

                            this.setLocalData();

                            this.drawTask(titleTextArea.value, this.taskClmnCntsArr[ind], this.taskClmnCntsArr[ind].identificId);
                            this.dragDropTask()

                            clmnCntArr[ind].append(item);
                        }
                    }

                    closeTaskButton.onclick = (evt) => {  
                        evt.stopPropagation()
                        clmnCntArr[ind].removeChild(titleTextArea);
                        clmnCntArr[ind].removeChild(taskTitleControls);
                        clmnCntArr[ind].append(item);
                    }
                        
                }
            })

        })
        
    }

    drawTask(taskDesctitle, content, identificId) {
        this.delTaskBtnArr = [];
        let taskContentTitle = document.createElement("div");
        taskContentTitle.classList.add("task-content-title");
        
        taskContentTitle.onclick = (evt) => {
            evt.stopPropagation()
        }

        taskContentTitle.identificId = identificId; 
        content.append(taskContentTitle);
                    
        let taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");
        taskContentTitle.append(taskTitle);
                    
        let title = document.createElement("p");
        title.classList.add("title");
        taskTitle.append(title);
        title.innerHTML = taskDesctitle;
         
        let deleteTaskButton = document.createElement("button");
        deleteTaskButton.classList.add("delete-task-button");
        taskTitle.appendChild(deleteTaskButton);
        deleteTaskButton.identificId = identificId;
        
        this.taskDescriptionContentLogo = document.createElement("img");
        this.taskDescriptionContentLogo.classList.add("task-description-content-logo");
        taskContentTitle.append(this.taskDescriptionContentLogo);

        this.container.querySelectorAll(".delete-task-button").forEach(item => {
            this.delTaskBtnArr.push(item);
                item.onclick = (evt) => {
                    evt.stopPropagation();
                    
                    let delTaskBtnFilterArr = this.delTaskBtnArr.filter(elem => elem.identificId === item.identificId);
                    let ind = this.taskClmnCntsArr.findIndex(elem => elem.identificId === item.identificId);
                    this.data[ind].tasks.splice(delTaskBtnFilterArr.indexOf(item),1);
                    
                    this.setLocalData();
                    this.containerBoard.innerHTML = "";
                    this.drawContent(this.data);
                    this.drawContainerBoard();
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
                
                taskContentOverlay.classList.add("task-content__overlay-window_display-block");
                
                let modalHeader = document.createElement("div");
                modalHeader.classList.add("modal-header");
                taskContentModal.append(modalHeader);

                let columnTitleInfo = document.createElement('span');
                columnTitleInfo.classList.add("column-title-info")
                taskContentModal.append(columnTitleInfo);
                columnTitleInfo.innerHTML = `in column ${this.data[taskClmnCntInd].title}`;
                
                let taskContentModalTitle = document.createElement('p');
                taskContentModalTitle.classList.add("modal-title");
                modalHeader.append(taskContentModalTitle)
                taskContentModalTitle.innerHTML = this.data[taskClmnCntInd].tasks[ind].title
                
                let taskContentModalTitleTextArea = document.createElement('textarea');
                taskContentModalTitleTextArea.classList.add("modal-task-title-text-area");
                
                let modalCloseButton = document.createElement("button");
                modalCloseButton.classList.add("modal-close-button");
                modalCloseButton.innerHTML = "x";
                taskContentModalTitle.onclick = (evt) => {
                    evt.stopPropagation()
                    modalCloseButton.remove()
                    modalHeader.removeChild(taskContentModalTitle)
                    modalHeader.append(taskContentModalTitleTextArea)

                    taskContentModalTitleTextArea.value = this.data[taskClmnCntInd].tasks[ind].title
                    taskContentModalTitleTextArea.select()

                    modalHeader.append(modalCloseButton);
                    taskContentModalTitleTextArea.addEventListener("keypress", evt => {
                        if(evt.keyCode === 13) {
                            taskContentModalTitle.value = taskContentModalTitleTextArea.value;
                            modalHeader.innerHTML = "";
                            taskContentModalTitleTextArea.remove()
                            modalHeader.append(taskContentModalTitle)
                            modalHeader.append(modalCloseButton);
                            this.data[taskClmnCntInd].tasks[ind].title = taskContentModalTitleTextArea.value
                            taskContentModalTitle.innerHTML = this.data[taskClmnCntInd].tasks[ind].title

                            this.setLocalData();
                        }
                    })
                }
                modalHeader.append(modalCloseButton);

                modalDescriptionContent = document.createElement("div");
                modalDescriptionContent.classList.add("modal-description-content");
                taskContentModal.append(modalDescriptionContent);

                let modalDescriptionTitle = document.createElement("p");
                modalDescriptionTitle.classList.add("description-title");
                modalDescriptionTitle.innerHTML = "Description";
                modalDescriptionContent.append(modalDescriptionTitle);

                modalDescriptionTextAreaContent = document.createElement("div");
                modalDescriptionTextAreaContent.classList.add("modal-description-text-area-content");
                modalDescriptionContent.append(modalDescriptionTextAreaContent);
                
                let modalDescriptionControls = document.createElement("div");
                modalDescriptionControls.classList.add("modal-description__controls");

                let addDescriptionButton = document.createElement("button")
                addDescriptionButton.classList.add("button-add-description");
                addDescriptionButton.innerHTML = "Add description";         

                let closeDescriptionButton = document.createElement("button");
                closeDescriptionButton.classList.add("modal-description-close-button");
                closeDescriptionButton.innerHTML = "x";
                modalDescription = document.createElement("p");
                modalDescription.classList.add("modal-description");
                
                modalDescriptionTextArea = document.createElement("textarea");
                modalDescriptionTextArea.classList.add("modal-description-text-area");
                
                if(this.data[taskClmnCntInd].tasks[ind].description === "") {
                    modalDescriptionTextArea.placeholder = "task description . . .";
                    modalDescriptionTextAreaContent.append(modalDescriptionTextArea);
                    
                    modalDescriptionTextArea.placeholder = "task description . . .";
                    modalDescriptionTextArea.value = "";
                    modalDescriptionTextAreaContent.append(modalDescriptionControls);
                    modalDescriptionControls.append(addDescriptionButton);
                    modalDescriptionControls.append(closeDescriptionButton);
                                        
                    addDescriptionButton.onclick = () => {
                        if(modalDescriptionTextArea.value != "") {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                            modalDescriptionContent.append(modalDescription)
                            modalDescription.textContent = modalDescriptionTextArea.value;
                            this.data[taskClmnCntInd].tasks[ind].description = modalDescription.textContent;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value === "") {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                            modalDescriptionContent.append(modalDescription)
                            modalDescription.textContent = "task description . . .";
                            this.data[taskClmnCntInd].tasks[ind].description = "";
                            this.setLocalData();
                        }
                    }

                    modalDescription.onclick = () => {
                        modalDescriptionContent.removeChild(modalDescription);
                        modalDescriptionContent.append(modalDescriptionTextAreaContent);
                        modalDescriptionTextArea.value = this.data[taskClmnCntInd].tasks[ind].description;
                        modalDescriptionTextArea.select();
                        this.setLocalData();
                    }

                    closeDescriptionButton.onclick = () => {
                        if(modalDescriptionTextArea.value === "" && this.data[taskClmnCntInd].tasks[ind].description != "") {
                            modalDescriptionTextAreaContent.remove()
                            modalDescriptionContent.append(modalDescription);
                            modalDescriptionTextArea.value = this.data[taskClmnCntInd].tasks[ind].description;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value === "" && this.data[taskClmnCntInd].tasks[ind].description === "") {
                            modalDescriptionTextAreaContent.remove()
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = "task description . . .";
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value != "" && this.data[taskClmnCntInd].tasks[ind].description != "") {
                            modalDescriptionTextAreaContent.remove();
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = modalDescription.textContent;
                            modalDescriptionTextArea.value = modalDescription.textContent;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value != "" && this.data[taskClmnCntInd].tasks[ind].description === "") {
                            modalDescriptionTextAreaContent.remove();
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = "task description . . .";
                            this.setLocalData();
                        }
                    } 
                }
                
                if(this.data[taskClmnCntInd].tasks[ind].description != "") {
                    modalDescriptionContent.append(modalDescription)
                    modalDescription.onclick = () => { 
                        modalDescriptionContent.removeChild(modalDescription);
                        modalDescriptionContent.append(modalDescriptionTextAreaContent);
                        modalDescriptionTextAreaContent.append(modalDescriptionTextArea);
                        modalDescriptionTextAreaContent.append(modalDescriptionControls);
                        modalDescriptionControls.append(addDescriptionButton);
                        modalDescriptionControls.append(closeDescriptionButton);
                        modalDescriptionTextArea.placeholder = "task description . . .";

                        modalDescriptionTextArea.value = this.data[taskClmnCntInd].tasks[ind].description;
                        modalDescriptionTextArea.select();
                        this.setLocalData();
                    }
                    modalDescription.textContent = this.data[taskClmnCntInd].tasks[ind].description

                    addDescriptionButton.onclick = () => {
                        if(modalDescriptionTextArea.value === "") {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                            modalDescriptionContent.append(modalDescription)
                            
                            modalDescription.textContent = "task description . . .";
                            this.data[taskClmnCntInd].tasks[ind].description = "";
                            this.setLocalData();
                        } else {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent)
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = modalDescriptionTextArea.value;
                            this.data[taskClmnCntInd].tasks[ind].description = modalDescription.textContent
                            this.setLocalData();
                        }
                    }

                    closeDescriptionButton.onclick = () => {
                        if(modalDescriptionTextArea.value === "" && this.data[taskClmnCntInd].tasks[ind].description != "") {
                            modalDescriptionTextAreaContent.remove()
                            modalDescriptionContent.append(modalDescription);
                            modalDescriptionTextArea.value = this.data[taskClmnCntInd].tasks[ind].description;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value === "" && this.data[taskClmnCntInd].tasks[ind].description === "") {
                            modalDescriptionTextAreaContent.remove()
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = "task description . . .";
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value != "" && this.data[taskClmnCntInd].tasks[ind].description != "") {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = modalDescription.textContent;
                            modalDescriptionTextArea.value = modalDescription.textContent;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value != "" && this.data[taskClmnCntInd].tasks[ind].description === "") {
                            modalDescriptionTextAreaContent.remove();
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = "task description . . .";
                            this.setLocalData();
                        }
                    }
                }
                
                modalCloseButton.onclick = () => {
                    taskContentOverlay.classList.add("task-content__overlay-window");
                    taskContentOverlay.classList.remove("task-content__overlay-window_display-block");
                    taskContentModal.removeChild(modalHeader);
                    taskContentModal.removeChild(modalDescriptionContent);
                    taskContentModal.removeChild(columnTitleInfo)
                    this.containerBoard.innerHTML = "";
                    this.setLocalData();

                    this.drawContent(this.data);
                    this.drawContainerBoard();
                } 
            }
         })
    }

    drawContainerBoard() {
        this.addColumnButton = document.createElement("div");
        this.addColumnButton.classList.add("button-add-column");
        this.addColumnButton.classList.add("column");
        this.addColumnButton.innerHTML = "+ add column";
        this.containerBoard.append(this.addColumnButton);
        this.buttonClicked = true;
        this.xCoordinatesArr = [];
  
        this.container.querySelectorAll(".column").forEach(button => {
            button.onclick = (evt) => {
                evt.stopPropagation();
                if(button.buttonClicked != true && button.innerHTML === "+ add column") {
                    evt.stopPropagation();
                    button.innerHTML = "";
                    button.classList.remove("button-add-column");
                    evt.stopPropagation();
    
                    let titleInput = document.createElement("input");
                    titleInput.classList.add("title-input");
                    button.append(titleInput);
                    titleInput.placeholder = "Enter column title";
    
                    titleInput.onclick = (evt) => {
                        evt.stopPropagation();
                    }
    
                    let columnTitleControls = document.createElement("div");
                    columnTitleControls.classList.add("column__title-controls");
                    button.append(columnTitleControls);
    
                    let addColumnTitle = document.createElement("button");
                    addColumnTitle.classList.add("button-add-title");
                    addColumnTitle.innerHTML = "Add column";
                    columnTitleControls.append(addColumnTitle);
                    
                    addColumnTitle.onclick = (evt) => {
                        evt.stopPropagation();
                        if(titleInput.value != "") {   
                            let identificId = 'identificId_' + Math.random(1, 1000);
    
                            button.identificId = identificId;
                            this.column = {};
                            this.column.identificId = identificId;
                            button.innerHTML = "";
                            this.column.title = titleInput.value;
                            this.column.tasks = [];
                            this.data.push(this.column);
                            button.innerHTML = "";
                            this.setLocalData();
                            
                            this.drawColumn(this.column.title, this.column.identificId);
                            this.drawTaskContent(this.columnContent, identificId);
                            this.drawContainerBoard();
                            this.dragDropTask();
                        }
                    }
    
                    let closeColumnButton = document.createElement("button");
                    closeColumnButton.classList.add("close-button");
                    closeColumnButton.innerHTML = "x";
                    columnTitleControls.append(closeColumnButton);
    
                    closeColumnButton.onclick = (evt) => {
                        evt.stopPropagation();
                        this.addColumnButton.classList.add("button-add-column");
                        button.innerHTML = "+ add column";
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

        this.columnContent;
        
        this.containerBoard = document.createElement("div");
        this.containerBoard.classList.add("container__board");
        this.container.append(this.containerBoard);

        this.drawContainerBoard();
        this?.data?.forEach((el) => {
            let identificId = el.identificId; 
            this.addColumnButton.innerHTML = "";
            this.addColumnButton.classList.remove("button-add-column");
            this.addColumnButton.identificId = identificId;
            
            this.drawColumn(el.title, identificId);
            this.drawtaskDescriptionContentLogo(el);
            this.drawTaskContent(this.columnContent, identificId);
            this.drawContainerBoard();
        })
        this.dragDropTask();
    }
    
    
    drawContent(data) {
        data?.forEach((el) => {
            let identificId = el.identificId; 
            this.addColumnButton = document.createElement("div");
            this.addColumnButton.classList.add("column");
            this.addColumnButton.identificId = el.identificId;
            this.containerBoard.append(this.addColumnButton);
            
            this.drawColumn(el.title, identificId);
            this.drawtaskDescriptionContentLogo(el);
            this.drawTaskContent(this.columnContent, identificId);
        })
        this.dragDropTask()
    }
    
    drawtaskDescriptionContentLogo(elem) {
        elem.tasks.forEach((task) => {
            this.drawTask(task.title, this.taskContent, this.taskContent.identificId);
            if(task.description === "") {
                this.taskDescriptionContentLogo.classList.remove("task-description-content-logo_display-block");
                this.taskDescriptionContentLogo.classList.add("task-description-content-logo");
            }
            if(task.description != "") {
                this.taskDescriptionContentLogo.classList.add("task-description-content-logo_display-block");
            }
        })
    }
    
    dragDropTask() { 
        var taskTitleArr = [...this.container.querySelectorAll(".task-content-title")];
        var taskTitleFilterArr
        this.draggedItem = null;
        let self = this;
        self.taskYCoordinatesArr = [];
        self.taskYCoordinatesFilterArr = []
        this.yCoordinate;
        this.mouseYPosition;
        this.ind;
        this.task;

        this.container.querySelectorAll(".task-content-title").forEach(item => {
            
            if(item.getAttribute('dragActivated') == 'true') return;
            item.setAttribute('dragActivated', 'true');
            item.draggable = "true";
            
            item.addEventListener('dragstart', (evt) => {
                evt.stopPropagation();
                this.draggedItem = item;
                if(this.draggedItem) this.draggedItem.drop = false;
                this.mouseYPosition = evt.clientY;

                taskTitleFilterArr = taskTitleArr.filter(elem => elem.identificId === this.draggedItem.identificId);
                this.ind = taskTitleFilterArr.indexOf(this.draggedItem);
                this.task = this.data.find(elem => elem.identificId === this.draggedItem.identificId).tasks[this.ind];
                this.data.find(elem => elem.identificId === this.draggedItem.identificId).tasks.splice(this.ind,1);

                taskTitleFilterArr.forEach(item => {
                    self.taskYCoordinatesArr.push(item.getBoundingClientRect().y);
                })

                this.yCoordinate = self.taskYCoordinatesArr[this.ind];
                self.taskYCoordinatesArr.splice(this.ind,1);
                this.setLocalData();

                setTimeout(() => {
                    this.draggedItem.classList.remove("task-content-title");
                    this.draggedItem.classList.add("task-content-title-display-none");
                },0);

            });

            item.addEventListener('dragend', (evt) => {
                if(this.draggedItem != null && this.draggedItem.drop === false) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    this.draggedItem.classList.remove("task-content-title-display-none");
                    this.draggedItem.classList.add("task-content-title");
                    this.data.find(elem => elem.identificId === this.draggedItem.identificId).tasks.splice(this.ind,0,this.task);
                    self.columnsXCoordinatesArr.splice(this.ind, 0, this.yCoordinate)
                    this.setLocalData();
                }
            })

            
        })

        this.container.querySelectorAll(".column__task-content").forEach(cnt => {

            if(cnt.getAttribute('dragActivated') == 'true') return;
            
            cnt.setAttribute('dragActivated', 'true');

            cnt.addEventListener('dragover', evt => {
                evt.preventDefault()
            })

            cnt.addEventListener('drop', evt => {
                evt.preventDefault();
                evt.stopPropagation();
                if(cnt.childNodes.length != 0) {
                    if(this.draggedItem != null) {
                        taskTitleArr = [...this.container.querySelectorAll(".task-content-title")];
                        let a = this.data.find(item => item.identificId === cnt.identificId)
                        taskTitleFilterArr = taskTitleArr.filter(item => item.identificId === a.identificId)
                        self.taskYCoordinatesArr = []
                        taskTitleFilterArr.forEach(item => {
                            self.taskYCoordinatesArr.push(item.getBoundingClientRect().y)
                        })

                        let goal = evt.clientY;
                        var closest = self.taskYCoordinatesArr.reduce(function(prev, curr) {
                            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                        });

                        this.ind = self.taskYCoordinatesArr.indexOf(closest)
                        if(this.draggedItem.identificId != cnt.identificId) {
                            if(goal < closest) {
                                this.data.find(elem => elem.identificId === cnt.identificId).tasks.splice(this.ind, 0, this.task);
                                this.setLocalData()
                            }
                            else if(goal > closest) {
                                this.data.find(elem => elem.identificId === cnt.identificId).tasks.splice(this.ind+1, 0, this.task);
                                this.setLocalData()
                            }
                        } 

                        else if(this.draggedItem.identificId == cnt.identificId) {
                            if(goal < closest && goal > this.mouseYPosition) {
                                this.data.find(elem => elem.identificId === cnt.identificId).tasks.splice(this.ind-1, 0, this.task);
                                this.setLocalData()
                            }
                            else if(goal < closest && goal < this.mouseYPosition) {
                                this.data.find(elem => elem.identificId === cnt.identificId).tasks.splice(this.ind, 0, this.task);
                                this.setLocalData()
                            }
                            else if(goal > closest && goal > this.mouseYPosition) {
                                this.data.find(elem => elem.identificId === cnt.identificId).tasks.splice(this.ind, 0, this.task);
                                this.setLocalData()
                            }
                        }
                        
                        this.draggedItem.drop = true

                        this.containerBoard.innerHTML = "";
                        this.setLocalData();

                        this.drawContent(this.data);
                        this.drawContainerBoard();
                    }
                }
                else {
                    if(this.draggedItem != null) {
                    this.data.find(elem => elem.identificId === cnt.identificId).tasks.splice(0, 0, this.task);
                    this.setLocalData();
                    
                    this.draggedItem.drop = true

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
            
            self.columnsXCoordinatesArr.push(item.getBoundingClientRect().x)

            if(item.classList.contains('button-add-column') === true || item.getAttribute('dragActivated') == 'true'){
                return
            }
            
            item.setAttribute('dragActivated', 'true');

            item.draggable = "true";
            item.addEventListener('dragstart', (evt) => {
                evt.stopPropagation();
                mouseXPosition = evt.clientX;
                draggedItem = item;

                if(draggedItem != null) draggedItem.drop = false;
                ind = this.data.findIndex(elem => elem.identificId === draggedItem.identificId);
                clmn = this.data[ind];
                this.data.splice(ind,1);
                xCoordinate = self.columnsXCoordinatesArr[ind];
                self.columnsXCoordinatesArr.splice(ind, 1);
                this.setLocalData();


                setTimeout(() => {
                    draggedItem.classList.remove("column");
                    draggedItem.classList.add("column-display-none");
                },0)
            })

            this.containerBoard.addEventListener("dragover", (evt) => {
                evt.preventDefault();
            })

            this.containerBoard.addEventListener('drop', (evt) => {
                evt.preventDefault()
                evt.stopPropagation();

                if(draggedItem != null && item.classList.contains('button-add-column') === false) {
                    let goal = evt.clientX;
                    var closest = self.columnsXCoordinatesArr.reduce(function(prev, curr) {
                        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                    });

                    draggedItem.drop = true;

                    if(goal < closest && goal > mouseXPosition) {
                        this.data.splice(self.columnsXCoordinatesArr.indexOf(closest)+1, 0, clmn);
                        this.setLocalData();
                    } else if(goal < closest && goal < mouseXPosition) {
                        this.data.splice(self.columnsXCoordinatesArr.indexOf(closest), 0, clmn);
                        this.setLocalData();
                    } else if(goal > closest && goal < mouseXPosition) {
                        this.data.splice(self.columnsXCoordinatesArr.indexOf(closest), 0, clmn);
                        this.setLocalData();
                    } else if(goal > closest && goal > mouseXPosition) {
                        this.data.splice(self.columnsXCoordinatesArr.indexOf(closest)+1, 0, clmn);
                        this.setLocalData();
                    }

                    this.container.innerHTML = "";
                    this.render()
                    
                }
            })
            
                item.addEventListener('dragend', (evt) => {
                    if(draggedItem != null && draggedItem.drop === false) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        draggedItem.classList.remove("column-display-none");
                        draggedItem.classList.add("column");
                        this.data.splice(ind,0,clmn);
                        self.columnsXCoordinatesArr.splice(ind, 0, xCoordinate)
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
    setLocalData()
    {
        localStorage.setItem('columnsData', JSON.stringify(this.data))
    }
    
}

new Trello(document.querySelector(".container"))


