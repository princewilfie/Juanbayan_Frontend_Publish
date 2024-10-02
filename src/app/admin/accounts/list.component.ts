import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { Account } from '@app/_models';
import * as bootstrap from 'bootstrap';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    accounts: Account[] = [];
    currentAccount: Account = {
        id: '',
        acc_email: '',
        acc_passwordHash: '',
        acc_firstname: '',
        acc_lastname: '',
        acc_pnumber: '',
        acc_totalpoints: 0,
        acc_role: null,
        acc_acceptTerms: '',
        acc_image: '',
        acc_status: ''
    };
    isEditing = false;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.loadAccounts();
    }

    loadAccounts() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);
    }

    // Delete an account
    deleteAccount(id: string) {
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts.filter(x => x.id !== id);
            });
    }
}
