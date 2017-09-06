import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";

@Component({
    selector: 'password-prompt',
    templateUrl: "./prompt.component.html"
})
export class PromptComponent {

    private password: string = "";

    constructor(private dialogRef: MdDialogRef<PromptComponent>,
                @Inject(MD_DIALOG_DATA) private data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
