class Trello {
    constructor(container) {
        this.container = container;
        this.data = this.getLocalData() || [];
        this.render();
    }

    drawColumn(title) 
    {   
        this.columnContent = document.createElement("div");
        this.columnContent.classList.add("column-content");
        this.addColumnButton.append(this.columnContent);
        this.columnContent.id = this.id + '';
        // this.ClmnCntsArr.push(this.columnContent);
            
        let columnTitleContent = document.createElement("div");
        columnTitleContent.classList.add("column-title-content");
        this.columnContent.append(columnTitleContent);

        let columnTitle = document.createElement("input");
        columnTitle.classList.add("column-title");
        columnTitleContent.append(columnTitle);
        columnTitle.value = title;

        this.deleteColumnButton = document.createElement("button");
        this.deleteColumnButton.classList.add("column-delete-button");
        columnTitleContent.append(this.deleteColumnButton);
        this.deleteColumnButton.id = this.id + ''
        
        this.clmnDelBtnArr = [];

        this.taskContent = document.createElement("div");
        this.taskContent.classList.add("column__task-content");
        this.columnContent.append(this.taskContent);
        this.taskContent.id = this.id + '';
        // this.taskClmnCntsArr.push(this.taskContent);
        

        this.container.querySelectorAll(".column-delete-button").forEach(item => {
            this.clmnDelBtnArr.push(item)
            
            item.onclick = (evt) => {

            evt.stopPropagation()
            let ind = this.clmnDelBtnArr.indexOf(item)
            this.data.splice(ind,1)
            this.setLocalData()

            this.containerBoard.innerHTML = "";
            console.log(this.taskClmnCntsArr[ind]);
            this.data.forEach(elem => {
                this.addColumnButton = document.createElement("div");
                this.addColumnButton.classList.add("column");
                this.containerBoard.append(this.addColumnButton);
                this.drawColumn(elem.title);
                
                elem.tasks.forEach((task) => {
                    this.drawTask(task.title,this.taskContent);
                })
                this.drawTaskContent();
                
            //     // this.taskClmnCntsArr.push(this.taskContent)
            //     // console.log(item);
            //     // let cnt = this.taskClmnCntsArr.find(item1 => item1.id === item.id)
            //     // console.log(cnt);
            //     // item.tasks.forEach((task) => {
            //     //     this.drawTask(task.title, cnt)
            //     // })


            })
            
            this.drawContainerBoard();
            
            // let a = this.taskClmnCntsArr.find(item1 => item1.id === item.id)
            // console.log(a);
            // // a.append(this.taskContent)
            // let cnt = this.taskClmnCntsArr.find(item1 => item1.id === item.id)
               
            
            // this.containerBoardObj.forEach(elem => {
            //     this.addColumnButton = document.createElement("div");
            //     this.addColumnButton.classList.add("column");
            //     this.containerBoard.append(this.addColumnButton);
            //     this.drawColumn(elem.title)
            // //     // if(elem.tasks != []) {
            // //     //     elem.tasks.forEach((item1) => {
            // //     //             this.drawTask(item1, this.taskContent)
            // //     //             console.log(this.taskClmnCntsArr);
            // //     //         })
            // //     //     }

            // });
            // this.drawTaskContent() 

            // this.drawContainerBoard()
            }
            console.log(this.data);
            
        })
        
                

    }

    
    drawTaskContent() 
    { 
        this.taskClmnCntsArr = [];
        this.addTaskButtonArr = [];
        this.addTaskButton = document.createElement("button");
        this.addTaskButton.classList.add("button-add-task");
        this.addTaskButton.innerHTML = "+ add Task";
        this.taskContent.append(this.addTaskButton);
        this.addTaskButton.id = this.id + '';
        this.container.querySelectorAll(".column__task-content").forEach(taskCnt => {
            this.taskClmnCntsArr.push(taskCnt)

        this.container.querySelectorAll(".button-add-task").forEach((item) => { 
            this.addTaskButtonArr.push(item)
            item.onclick = (evt) => {
                evt.stopPropagation()
                item.remove();
                let cnt = this.addTaskButtonArr.indexOf(item);
                console.log(cnt);
                let titleTextArea = document.createElement("textarea");
                titleTextArea.classList.add("task-content__textarea");
                this.taskClmnCntsArr[cnt].append(titleTextArea);
                titleTextArea.placeholder = "Enter task title"

                titleTextArea.onclick = (evt) => {
                    evt.stopPropagation()
                }
                let taskTitleControls = document.createElement("div");
                        taskTitleControls.classList.add("column__title-controls");
                        this.taskClmnCntsArr[cnt].append(taskTitleControls);
        
                        let addTaskTitle = document.createElement("button");
                        addTaskTitle.classList.add("button-add-column__title");
                        addTaskTitle.innerHTML = "Add column";
                        taskTitleControls.append(addTaskTitle);
        
                        let closeTaskButton = document.createElement("button");
                        closeTaskButton.classList.add("column-close-button");
                        closeTaskButton.innerHTML = "x";
                        taskTitleControls.append(closeTaskButton);
                        addTaskTitle.onclick = (evt) => {
                            if(titleTextArea.value != "") 
                            {   evt.stopPropagation()
                                this.taskClmnCntsArr[cnt].removeChild(titleTextArea);
                                this.taskClmnCntsArr[cnt].removeChild(taskTitleControls)
                                this.data[cnt].tasks.push({title:titleTextArea.value, description:''})
                                // console.log(this.containerBoardObj);
                                this.setLocalData()
                               
                                this.drawTask(titleTextArea.value, this.taskClmnCntsArr[cnt])
                                 
                                // let cnt = this.taskClmnCntsArr.find(item => item.id === elem.id)

                                // this.drawTask(titleTextArea.value, this.taskClmnCntsArr[ind])
                                this.taskClmnCntsArr[cnt].append(item)

                            }}
                        // this.data.forEach((elem) => {
                        //     if(elem.id === item.id) {
                        //         elem.tasks.forEach((task) => {
                        //             this.drawTask(task.title,this.taskClmnCntsArr[cnt]);
                        //         })
                        //     }
                        // })
                        
                // this.drawTaskContent();
                // this.taskClmnCntsArr.forEach((elem) => {
                //     if(elem.id === item.id) {
                //         let ind = this.taskClmnCntsArr.indexOf(elem)
                //         console.log(ind);
                //         console.log(this.taskClmnCntsArr);
                //         console.log(this.taskClmnCntsArr[ind]);
                //         this.taskClmnCntsArr[ind].removeChild(item);
                        
                        

                //         let titleTextArea = document.createElement("textarea");
                //         titleTextArea.classList.add("task-content__textarea");
                //         elem.append(titleTextArea);
                //         titleTextArea.placeholder = "Enter task title"
                //         titleTextArea.onclick = (evt) => {
                //             evt.stopPropagation()
                //         }
                //         console.log(this.ClmnCntsArr);
        
                //         // this.buttonClicked = false
        
                //         let taskTitleControls = document.createElement("div");
                //         taskTitleControls.classList.add("column__title-controls");
                //         elem.append(taskTitleControls);
        
                //         let addTaskTitle = document.createElement("button");
                //         addTaskTitle.classList.add("button-add-column__title");
                //         addTaskTitle.innerHTML = "Add column";
                //         taskTitleControls.append(addTaskTitle);
        
                //         let closeTaskButton = document.createElement("button");
                //         closeTaskButton.classList.add("column-close-button");
                //         closeTaskButton.innerHTML = "x";
                //         taskTitleControls.append(closeTaskButton);

                        

                //         addTaskTitle.onclick = (evt) => {
                //             if(titleTextArea.value != "") 
                //             {   evt.stopPropagation()
                //                 elem.removeChild(titleTextArea);
                //                 elem.removeChild(taskTitleControls)
                //                 this.data[ind].tasks.push({title:titleTextArea.value, description:''})
                //                 // console.log(this.containerBoardObj);
                //                 this.setLocalData()
                //                 // let taskContentTitle = document.createElement("div");
                //                 // taskContentTitle.classList.add("task-content-title");
                //                 // taskContentTitle.draggable = "true"
                //                 // taskContentTitle.id = "item"
                //                 // elem.append(taskContentTitle);
                                
                                
                //                 // let taskTitle = document.createElement("div")
                //                 // taskTitle.classList.add("task-title");
                //                 // taskContentTitle.append(taskTitle);
                                

                //                 // let title = document.createElement("p");
                //                 // title.classList.add("title");
                //                 // taskTitle.append(title);
                //                 // title.innerHTML = titleTextArea.value;
                //                 // let deleteTaskButton = document.createElement("button");
                //                 // deleteTaskButton.classList.add("delete-task-button");
                //                 // taskTitle.appendChild(deleteTaskButton);
                                
        
                //                 // let taskDescriptionContentLogo = document.createElement("img");
                //                 // taskDescriptionContentLogo.classList.add("task-description-content-logo");
                //                 // taskContentTitle.append(taskDescriptionContentLogo);
                                 
                //                 let cnt = this.taskClmnCntsArr.find(item => item.id === elem.id)

                //                 this.drawTask(titleTextArea.value, this.taskClmnCntsArr[ind])
                //                 elem.append(item)

                //             }}
                                
                //     }
                // })
            }
            })
        })
        
        
        
        
    }

    drawTask(taskDesctitle, content) {
        
        this.delTaskBtnArr = [];

        let taskContentTitle = document.createElement("div");
        taskContentTitle.classList.add("task-content-title");
        taskContentTitle.draggable = "true"
        // this.container.querySelectorAll(".column__task-content").forEach((item) => {
            content.append(taskContentTitle)
        // });
        taskContentTitle.id = this.id + '';    
                    
        let taskTitle = document.createElement("div")
        taskTitle.classList.add("task-title");
        taskContentTitle.append(taskTitle);
                    
                    
        let title = document.createElement("p");
        title.classList.add("title");
        taskTitle.append(title);
                    
        title.innerHTML = taskDesctitle;
                    
        let deleteTaskButton = document.createElement("button");
        deleteTaskButton.classList.add("delete-task-button");
        taskTitle.appendChild(deleteTaskButton);
        deleteTaskButton.id = this.id;
        // deleteTaskButton.text = taskDesctitle;

        this.container.querySelectorAll(".delete-task-button").forEach(item => {
            this.delTaskBtnArr.push(item);
            item.onclick = (evt) => {
                evt.stopPropagation();
                console.log(this.delTaskBtnArr);
                console.log(item);
            }
        })
    //     this.delTaskBtnArr.push(deleteTaskButton)
    //     this.delTaskBtnArr.forEach(item => {
    //     item.onclick = (evt) => {
    //         evt.stopPropagation()
    //         let ind = this.delTaskBtnArr.indexOf(item)
    //         // console.log(this.container.querySelectorAll(".delete-task-button"));
    //         // this.container.querySelectorAll(".delete-task-button").forEach(item => {
    //             // this.containerBoardObj.forEach(elem => {
    //                 // elem.tasks.forEach((item1) => {
    //                     // if(deleteTaskButton.id === elem.id) {
    //                     //     console.log(elem);
    //                     // }
    //                 // })
    //                 console.log(deleteTaskButton.text);
    //                 // let ind = this.data.find((elem) => elem.id === deleteTaskButton.id)
    //                 // let ind1 = ind.tasks.findIndex((elem) => elem === deleteTaskButton.text)
    //                 ind.tasks.splice(ind,1)
    //                 console.log(ind);
    //                 // taskContentTitle.innerHTML = ""
    //                 this.setLocalData()
                    
    //                 ind.tasks.forEach(item => {
    //                     this.drawTask(item.title)
    //                 })
                    
    //                 // this.drawTaskContent()
    //                 // ind.tasks.forEach(item => {
    //                 //     // if(deleteTaskButton.text = item) {
    //                 //     //     ind.
    //                 //     // }
    //                 //     console.log(item);
    //                 // })
    //                 // console.log(ind.tasks);
    //             // })

    //         // })
    //         // let ind = this.containerBoardObj.find((elem) => elem.id === deleteTaskButton.id);
    //         // console.log(ind);
    //         // this.containerBoardObj.splice(ind,1)
    //         this.drawTaskContent()
    //     }
    // })
        let taskDescriptionContentLogo = document.createElement("img");
        taskDescriptionContentLogo.classList.add("task-description-content-logo");
        taskContentTitle.append(taskDescriptionContentLogo);

    }
    
    drawModalWindow() {
        let modalDescriptionContent;
        let modalDescriptionTextAreaContent;
        let modalDescription;
        let modalDescriptionTextArea;
        let modalDescriptionText = ""
        this.container.querySelectorAll(".task-content-title").forEach((elem) => {
            elem.onclick = (evt) => {
                evt.stopPropagation()
                let taskContentOverlay = document.querySelector(".task-content__overlay-window");
                let taskContentModal = document.querySelector(".task-content__modal");
                taskContentOverlay.classList.add("task-content__overlay-window_display-block");
                
                let modalHeader = document.createElement("div");
                modalHeader.classList.add("modal-header");
                taskContentModal.append(modalHeader);

                let taskContentModalTitle = document.createElement('textarea');
                taskContentModalTitle.classList.add("modal-title");
                modalHeader.append(taskContentModalTitle);
                JSON.parse(this.localStorageObj).forEach(item => {
                    item.tasks.forEach(item1 => {
                        if(elem.id === item.id) {
                        taskContentModalTitle.value = item1
                        }
                    })
                })
                
            }
        })
    }

    drawContainerBoard() {
        this.id = Date.now() + Math.random(1, 1000); 
        this.addColumnButton = document.createElement("div");
        this.addColumnButton.classList.add("button-add-column");
        this.addColumnButton.classList.add("column");
        this.addColumnButton.innerHTML = "+ add column";
        this.containerBoard.append(this.addColumnButton);
        this.buttonClicked = true;
        
  
        this.addColumnButton.onclick = (evt) => {
            evt.stopPropagation();


            if(this.buttonClicked === true) {
                // this.columnCntObj = {};
                // this.containerBoardObj.push(this.columnCntObj)
                
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
                        this.addColumnButton.id = this.id;
                        this.column = {};
                        this.column.id = this.id + '';
                        this.addColumnButton.innerHTML = "";
                        this.column.title = titleInput.value;
                        this.column.tasks = [];
                        this.data.push(this.column);
                        this.addColumnButton.innerHTML = "";
                        this.setLocalData();
                        
                        this.drawColumn(this.column.title);
                        this.drawTaskContent();
                        this.drawModalWindow();
                        
                        
                       
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
        this.drawModalWindow();

    this?.data?.forEach((el) => {
        this.addColumnButton.innerHTML = "";
        this.addColumnButton.classList.remove("button-add-column");
        this.addColumnButton.id = this.id;
        this.drawColumn(el.title);

        el.tasks.forEach((task) => {
            this.drawTask(task.title, this.taskContent);
        })
        this.drawTaskContent();
        this.drawContainerBoard();

    })
    

    }
    
    getLocalData(){
         let localData = localStorage.getItem("columnsData") || '[]';
         return JSON.parse(localData);
    }
    setLocalData(){
        localStorage.setItem('columnsData', JSON.stringify(this.data))
    }
    
}

new Trello(document.querySelector(".container"))

