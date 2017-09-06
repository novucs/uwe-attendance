import {ScanComponent} from "./component/scan.component";
import {CanDeactivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {MdDialog, MdSnackBar} from "@angular/material";
import {PromptComponent} from "./component/prompt.component";
import {isNullOrUndefined} from "util";

const PASSWORD: string = "pass";

@Injectable()
export class ConfirmDeactivateGuard implements CanDeactivate<ScanComponent> {

    private canClose: boolean = false;

    constructor(private router: Router,
                private snackBar: MdSnackBar,
                private dialog: MdDialog) {
    }

    canDeactivate(target: ScanComponent) {
        if (this.canClose) {
            return true;
        }

        let dialogRef = this.dialog.open(PromptComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (isNullOrUndefined(result)) {
                return;
            }

            if (result != PASSWORD) {
                this.snackBar.open("Password entered is incorrect", "Close");
                setTimeout(() => {
                    this.snackBar.dismiss();
                }, 2000);
                return;
            }

            this.canClose = true;
            this.router.navigate([""]).then(() => {
                this.canClose = false;
            });
        });

        return false;
    }
}
