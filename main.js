class Trello {
    constructor(container) {
        this.container = container;
        this.data = this.getLocalData() || [];
        this.render();
    }

    drawColumn(title, id) 
    {           
        this.columnContent = document.createElement("div");
        this.columnContent.classList.add("column-content");
        this.addColumnButton.append(this.columnContent);
        this.columnContent.id = id;
            
        let columnTitleContent = document.createElement("div");
        columnTitleContent.classList.add("column-title-content");
        this.columnContent.append(columnTitleContent);

        let columnTitle = document.createElement("input");
        columnTitle.classList.add("column-title");
        columnTitleContent.append(columnTitle);
        columnTitle.value = title;
        columnTitle.id = id;
        
        columnTitle.addEventListener("keypress", evt => {
            evt.stopPropagation();
            if(evt.keyCode === 13) {
                columnTitle.value = columnTitle.value;
                columnTitleContent.innerHTML = "";
                columnTitleContent.append(columnTitle)
                columnTitleContent.append(this.deleteColumnButton);
                this.data.find(elem => elem.id === columnTitle.id).title = columnTitle.value
                this.setLocalData();
            }
        })
        
        this.deleteColumnButton = document.createElement("button");
        this.deleteColumnButton.classList.add("column-delete-button");
        columnTitleContent.append(this.deleteColumnButton);
        this.deleteColumnButton.id = id;


        this.taskContent = document.createElement("div");
        this.taskContent.classList.add("column__task-content");
        this.columnContent.append(this.taskContent);
        this.taskContent.id = id

        this.container.querySelectorAll(".column-delete-button").forEach(item => {
            
            item.onclick = (evt) => {
                evt.stopPropagation();
                
                let ind = this.data.findIndex(elem => elem.id === item.id)

                this.data.splice(ind,1);
                this.containerBoard.innerHTML = "";
                this.setLocalData();

                this.data.forEach(elem => {
                    this.addColumnButton = document.createElement("div");
                    this.addColumnButton.classList.add("column");
                    this.containerBoard.append(this.addColumnButton);
                    this.addColumnButton.id = elem.id
                    
                    this.drawColumn(elem.title, elem.id);
                    
                    this.drawtaskDescriptionContentLogo(elem)

                    this.drawTaskContent(this.taskContent, elem.id);
                })
                
                this.drawContainerBoard();
            }
            
        })     
        
    }

    
    drawTaskContent(cnt, id) 
    { 
        this.taskClmnCntsArr = [];
        this.addTaskButton = document.createElement("button");
        this.addTaskButton.classList.add("button-add-task");
        this.addTaskButton.innerHTML = "+ add Task";
        cnt.append(this.addTaskButton);
        this.addTaskButton.id = id;

        this.container.querySelectorAll(".column__task-content").forEach(taskCnt => {
            this.taskClmnCntsArr.push(taskCnt)

            this.container.querySelectorAll(".button-add-task").forEach((item) => { 
                item.onclick = (evt) => {
                    evt.stopPropagation();
                    item.remove();
                    let cnt = this.taskClmnCntsArr.findIndex(elem => elem.id === item.id)

                    let titleTextArea = document.createElement("textarea");
                    titleTextArea.classList.add("task-content__textarea");
                    this.taskClmnCntsArr[cnt].append(titleTextArea);
                    titleTextArea.placeholder = "Enter task title";

                    titleTextArea.onclick = (evt) => {
                        evt.stopPropagation();
                    }
                    let taskTitleControls = document.createElement("div");
                            taskTitleControls.classList.add("column__title-controls");
                            this.taskClmnCntsArr[cnt].append(taskTitleControls);
            
                            let addTaskTitle = document.createElement("button");
                            addTaskTitle.classList.add("button-add-column__title");
                            addTaskTitle.innerHTML = "Add task";
                            taskTitleControls.append(addTaskTitle);
                            addTaskTitle
            
                            let closeTaskButton = document.createElement("button");
                            closeTaskButton.classList.add("column-close-button");
                            closeTaskButton.innerHTML = "x";
                            taskTitleControls.append(closeTaskButton);
                            addTaskTitle.onclick = (evt) => 
                            {
                                let taskId = 'id_' + Math.random(1, 1000);
                                if(titleTextArea.value != "") 
                                {   evt.stopPropagation();
                                    this.taskClmnCntsArr[cnt].removeChild(titleTextArea);
                                    this.taskClmnCntsArr[cnt].removeChild(taskTitleControls);
                                    this.data[cnt].tasks.push({title:titleTextArea.value, description:'', id: taskId});
                                    
                                    this.setLocalData();
                                    this.drawTask(titleTextArea.value, this.taskClmnCntsArr[cnt], this.taskClmnCntsArr[cnt].id);

                                    this.taskClmnCntsArr[cnt].append(item);
                                }
                            }

                            closeTaskButton.onclick = (evt) => 
                            {   evt.stopPropagation()
                                this.taskClmnCntsArr[cnt].removeChild(titleTextArea);
                                this.taskClmnCntsArr[cnt].removeChild(taskTitleControls);

                                this.taskClmnCntsArr[cnt].append(item);

                            }
                        
                }
            })
        })
        
        
        
    }

    drawTask(taskDesctitle, content, id) {

        this.delTaskBtnArr = [];
        let taskContentTitle = document.createElement("div");
        taskContentTitle.classList.add("task-content-title");
        taskContentTitle.draggable = "true";
        taskContentTitle.id = id; 
        content.append(taskContentTitle);
           
                    
        let taskTitle = document.createElement("div");
        taskTitle.classList.add("task-title");
        taskContentTitle.append(taskTitle);
                    
                    
        let title = document.createElement("p");
        title.classList.add("title");
        taskTitle.append(title);
        title.innerHTML = taskDesctitle;
        title
         
        let deleteTaskButton = document.createElement("button");
        deleteTaskButton.classList.add("delete-task-button");
        taskTitle.appendChild(deleteTaskButton);
        deleteTaskButton.id = id;
        
        this.taskDescriptionContentLogo = document.createElement("img");
        this.taskDescriptionContentLogo.classList.add("task-description-content-logo");
        taskContentTitle.append(this.taskDescriptionContentLogo);
        
        this.container.querySelectorAll(".delete-task-button").forEach(item => {
            this.delTaskBtnArr.push(item);
                item.onclick = (evt) => {
                    evt.stopPropagation();
                    
                    let delTaskBtnArrFiltr = this.delTaskBtnArr.filter(elem => elem.id === item.id);
                    let ind = this.taskClmnCntsArr.findIndex(elem => elem.id === item.id);
                    this.data[ind].tasks.splice(delTaskBtnArrFiltr.indexOf(item),1);
                    
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
                let taskTitleArrFiltr = taskTitleArr.filter(item => item.id === elem.id); 
                
                let ind1 = this.taskClmnCntsArr.findIndex(item => item.id === elem.id);
                let ind = taskTitleArrFiltr.indexOf(elem);

                let taskContentOverlay = document.querySelector(".task-content__overlay-window");
                let taskContentModal = document.querySelector(".task-content__modal");
                
                taskContentOverlay.classList.add("task-content__overlay-window_display-block");
                
                let modalHeader = document.createElement("div");
                modalHeader.classList.add("modal-header");
                taskContentModal.append(modalHeader);

                let taskContentModalTitle = document.createElement('textarea');
                taskContentModalTitle.classList.add("modal-title");
                modalHeader.append(taskContentModalTitle);
                taskContentModalTitle.value = this.data[ind1].tasks[ind].title;

                taskContentModalTitle.addEventListener("keypress", evt => {
                    if(evt.keyCode === 13) {
                        taskContentModalTitle.value = taskContentModalTitle.value;
                        modalHeader.innerHTML = "";
                        modalHeader.append(taskContentModalTitle)
                        modalHeader.append(modalCloseButton);
                        this.data[ind1].tasks[ind].title = taskContentModalTitle.value
                        this.setLocalData();
                    }
                })

                let modalCloseButton = document.createElement("button");
                modalCloseButton.classList.add("modal-close-button");
                modalCloseButton.innerHTML = "x";
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

                
                if(this.data[ind1].tasks[ind].description === "") {
                    modalDescriptionTextArea.placeholder = "task description . . .";
                    modalDescriptionTextAreaContent.append(modalDescriptionTextArea);
                    
                    modalDescriptionTextArea.placeholder = "task description . . .";
                    modalDescriptionTextArea.value = "";
                    modalDescriptionTextAreaContent.append(modalDescriptionControls);
                    modalDescriptionControls.append(addDescriptionButton);
                    modalDescriptionControls.append(closeDescriptionButton);
                    
                    modalDescriptionContent.append(modalDescription);
                    
                    addDescriptionButton.onclick = () => {
                        if(modalDescriptionTextArea.value != "") {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                            modalDescriptionContent.append(modalDescription)
                            modalDescription.textContent = modalDescriptionTextArea.value;
                            this.data[ind1].tasks[ind].description = modalDescription.textContent;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value === "") {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                            modalDescriptionContent.append(modalDescription)
                            modalDescription.textContent = "task description . . .";
                            this.data[ind1].tasks[ind].description = "";
                            this.setLocalData();
                        }
                    
                    }    
                    modalDescription.onclick = () => {
                        modalDescriptionContent.removeChild(modalDescription);
                        modalDescriptionContent.append(modalDescriptionTextAreaContent);
                        modalDescriptionTextArea.value = this.data[ind1].tasks[ind].description;
                        modalDescriptionTextArea.select();
                        this.setLocalData();
                    }   
                    closeDescriptionButton.onclick = () => {
                        if(modalDescriptionTextArea.value === "" && this.data[ind1].tasks[ind].description != "") {
                            modalDescriptionTextAreaContent.remove()
                            modalDescriptionContent.append(modalDescription);
                            modalDescriptionTextArea.value = this.data[ind1].tasks[ind].description;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value === "" && this.data[ind1].tasks[ind].description === "") {
                            modalDescriptionTextAreaContent.remove()
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = "task description . . .";
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value != "" && this.data[ind1].tasks[ind].description != "") {
                            modalDescriptionTextAreaContent.remove();
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = modalDescription.textContent;
                            modalDescriptionTextArea.value = modalDescription.textContent;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value != "" && this.data[ind1].tasks[ind].description === "") {
                            modalDescriptionTextAreaContent.remove();
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = "task description . . .";
                            this.setLocalData();
                        }

                    } 

                }
                
                if(this.data[ind1].tasks[ind].description != "") {
                    modalDescriptionContent.append(modalDescription)
                    modalDescription.onclick = () => { 
                        modalDescriptionContent.removeChild(modalDescription);
                        modalDescriptionContent.append(modalDescriptionTextAreaContent);
                        modalDescriptionTextAreaContent.append(modalDescriptionTextArea);
                        modalDescriptionTextAreaContent.append(modalDescriptionControls);
                        modalDescriptionControls.append(addDescriptionButton);
                        modalDescriptionControls.append(closeDescriptionButton);
                        modalDescriptionTextArea.placeholder = "task description . . .";

                        modalDescriptionTextArea.value = this.data[ind1].tasks[ind].description;
                        modalDescriptionTextArea.select();
                        this.setLocalData();
                    }
                    modalDescription.textContent = this.data[ind1].tasks[ind].description
                    addDescriptionButton.onclick = () => {
                        if(modalDescriptionTextArea.value === "") {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                            modalDescriptionContent.append(modalDescription)
                            
                            modalDescription.textContent = "task description . . .";
                            this.data[ind1].tasks[ind].description = "";
                            this.setLocalData();
                        } else {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent)
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = modalDescriptionTextArea.value;
                            this.data[ind1].tasks[ind].description = modalDescription.textContent
                            this.setLocalData();
                        }
                    }
                    closeDescriptionButton.onclick = () => {
                        if(modalDescriptionTextArea.value === "" && this.data[ind1].tasks[ind].description != "") {
                            modalDescriptionTextAreaContent.remove()
                            modalDescriptionContent.append(modalDescription);
                            modalDescriptionTextArea.value = this.data[ind1].tasks[ind].description;
                            this.setLocalData();

                        }
                        if(modalDescriptionTextArea.value === "" && this.data[ind1].tasks[ind].description === "") {
                            modalDescriptionTextAreaContent.remove()
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = "task description . . .";
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value != "" && this.data[ind1].tasks[ind].description != "") {
                            modalDescriptionContent.removeChild(modalDescriptionTextAreaContent);
                            modalDescriptionContent.append(modalDescription);
                            modalDescription.textContent = modalDescription.textContent;
                            modalDescriptionTextArea.value = modalDescription.textContent;
                            this.setLocalData();
                        }
                        if(modalDescriptionTextArea.value != "" && this.data[ind1].tasks[ind].description === "") {
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
        // this.addColumnButton.draggable = "true";

        this.addColumnButton.innerHTML = "+ add column";
        this.containerBoard.append(this.addColumnButton);
        this.buttonClicked = true;
  
        this.addColumnButton.onclick = (evt) => {
            evt.stopPropagation();

            if(this.buttonClicked === true) {
                evt.stopPropagation();
                this.addColumnButton.innerHTML = "";
                this.addColumnButton.classList.remove("button-add-column");

                let titleInput = document.createElement("input");
                titleInput.classList.add("title-input");
                this.addColumnButton.append(titleInput);
                titleInput.placeholder = "Enter column title";


                titleInput.onclick = (evt) => {
                    evt.stopPropagation();
                }

                let columnTitleControls = document.createElement("div");
                columnTitleControls.classList.add("column__title-controls");
                this.addColumnButton.append(columnTitleControls);

                let addColumnTitle = document.createElement("button");
                addColumnTitle.classList.add("button-add-column__title");
                addColumnTitle.innerHTML = "Add column";
                columnTitleControls.append(addColumnTitle);
                
                addColumnTitle.onclick = (evt) => {
                    evt.stopPropagation();
                    if(titleInput.value != "") 
                    {   
                        let id = 'id_' + Math.random(1, 1000);

                        this.addColumnButton.id = id;
                        this.column = {};
                        this.column.id = id;
                        this.addColumnButton.innerHTML = "";
                        this.column.title = titleInput.value;
                        this.column.tasks = [];
                        this.data.push(this.column);
                        this.addColumnButton.innerHTML = "";
                        this.setLocalData();
                        
                        this.drawColumn(this.column.title, this.column.id);
                        this.drawTaskContent(this.taskContent, id);
                        this.drawContainerBoard();
                
                    }
                }
                
                let closeColumnButton = document.createElement("button");
                closeColumnButton.classList.add("column-close-button");
                closeColumnButton.innerHTML = "x";
                columnTitleControls.append(closeColumnButton);

                closeColumnButton.onclick = (evt) => {
                    evt.stopPropagation();
                    this.addColumnButton.classList.add("button-add-column");
                    this.addColumnButton.innerHTML = "+ add column";
                    this.buttonClicked = true;
                }
                this.buttonClicked = false;
            }
            
        }
        this.dragDropTask()

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
            let id = el.id; 
            this.addColumnButton.innerHTML = "";
            this.addColumnButton.classList.remove("button-add-column");
            this.drawColumn(el.title, id);

            this.drawtaskDescriptionContentLogo(el)
            this.drawTaskContent(this.taskContent, id);
            this.drawContainerBoard();
        })
        console.log(this.data);
    }
    
    
    drawContent(data) {
        data?.forEach((el) => {
            let id = el.id; 
            this.addColumnButton = document.createElement("div");
            this.addColumnButton.classList.add("column");
            this.addColumnButton.id = el.id
            this.containerBoard.append(this.addColumnButton);
            
            this.drawColumn(el.title, id);
            this.drawtaskDescriptionContentLogo(el)
            this.drawTaskContent(this.taskContent, id);
        })
    }
    
    drawtaskDescriptionContentLogo(elem) {
        elem.tasks.forEach((task) => {
            this.drawTask(task.title, this.taskContent, this.taskContent.id);
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
        let taskTitleArr = [];
        let draggedItem = null;
        this.container.querySelectorAll(".task-content-title").forEach(item => {
             
            item.addEventListener('dragstart', (e) => {
                e.stopPropagation()
                draggedItem = item;
                setTimeout(() => {
                    draggedItem.style.display = "none"
                },100)
            })
            item.addEventListener('dragend', (e) => {
                e.stopPropagation()
                draggedItem.style.display = "block";
            })
           
                
                item.addEventListener("dragover", (evt) => evt.preventDefault())
                item.addEventListener("drop", (evt) => {
                        taskTitleArr = [... document.querySelectorAll(".task-content-title")]
                        let taskTitleArrFiltr
                        if(draggedItem != null) {
                            taskTitleArrFiltr = taskTitleArr.filter(elem => elem.id === draggedItem.id)
                            let ind = taskTitleArrFiltr.indexOf(draggedItem)
                            console.log(ind);
                            let task = this.data.find(elem => elem.id === draggedItem.id).tasks[ind]
                            this.data.find(elem => elem.id === draggedItem.id).tasks.splice(ind,1)
                            this.setLocalData()
                            console.log(task);
                            if(evt.clientY-10 < item.getBoundingClientRect().y) {
                                item.before(draggedItem)
                                draggedItem.id = item.id
                                taskTitleArrFiltr = taskTitleArr.filter(elem => elem.id === item.id)
                            ind = taskTitleArrFiltr.indexOf(item)
                            this.data.find(elem => elem.id === item.id).tasks.splice(ind, 0, task)
                            this.setLocalData()
                            } 
                            if(evt.clientY+10 > item.getBoundingClientRect().y) {
                                item.after(draggedItem)
                                draggedItem.id = item.id
                                taskTitleArrFiltr = taskTitleArr.filter(elem => elem.id === item.id)
                            ind = taskTitleArrFiltr.indexOf(item)
                            this.data.find(elem => elem.id === item.id).tasks.splice(ind, 0, task)
                            this.setLocalData()
                            }
                            
                            console.log(taskTitleArrFiltr);
                            console.log(this.data);
                        }
                        
                        // console.log(draggedItem.id);
                })
            // })
            // this.container.querySelectorAll(".column__task-content").forEach(el => {
            //     el.addEventListener('drop', function(e)  {
            //         e.stopPropagation()
            //         console.log(item.clientY);
            //         // if(el.clientY < elem.getBoundingClientRect().y) {
            //         //     el.before(draggedItem)
            //         // }
            //     })
            // });
        })
        
        
    }
    
    // dragDropColumns() {
    //     this.container.querySelectorAll(".column").forEach(item => {
    //         item.addEventListener('dragstart', dragStart);
 
    //             function dragStart(evt) {
    //                 evt.dataTransfer.setData('text/plain', evt.target.id);
    //                 setTimeout(() => {
    //                     evt.target.classList.add('hide');
    //                 }, 0);
    //             }
    //         })


    //             document.querySelectorAll(".container-board").forEach(box => {
    //                 box.addEventListener('dragenter', dragEnter)
    //                 box.addEventListener('dragover', dragOver);
    //                 box.addEventListener('dragleave', dragLeave);
    //                 box.addEventListener('drop', drop);
    //             });


    //             function dragEnter(evt) {
    //                 evt.preventDefault();
    //                 evt.target.classList.add('drag-over');
    //             }

    //             function dragOver(evt) {
    //                 evt.preventDefault();
    //                 evt.target.classList.add('drag-over');
    //             }

    //             function dragLeave(evt) {
    //                 evt.target.classList.remove('drag-over');
    //             }

    //             function drop(evt) {
    //                 evt.preventDefault();
    //                 evt.stopPropagation()
    //                 evt.target.classList.remove('drag-over');

    //                 const id = evt.dataTransfer.getData('text/plain');
    //                 const draggable = document.getElementById(id);

    //                 evt.target.append(draggable);
    //                 console.log(evt.target);

    //                 draggable.classList.remove('hide');
    //             }

    // }

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

