const SELECTED_FILTER_KEY_LOCAL_STORAGE = "selectedTaskCompletedFilter"; 

class FilterState {
    constructor() {
        this.taskCompletedFilter = ["all", "completed", "not completed"];

        const storedFilter = localStorage.getItem(SELECTED_FILTER_KEY_LOCAL_STORAGE);
        let index = 0;

        console.log(storedFilter);
        if (storedFilter) {
            index = this.taskCompletedFilter.findIndex((filterItem) => filterItem == storedFilter);
            index = index > -1 ? index : 0;
        }
        this.selectedTaskCompletedFilter = this.taskCompletedFilter[index];
    }

    canDisplay(taskIsCompleted){
        return this.selectedTaskCompletedFilter == this.taskCompletedFilter[0]
            || this.selectedTaskCompletedFilter == this.taskCompletedFilter[1] && taskIsCompleted
            || this.selectedTaskCompletedFilter == this.taskCompletedFilter[2] && !taskIsCompleted;
    }
}

export {FilterState, SELECTED_FILTER_KEY_LOCAL_STORAGE};