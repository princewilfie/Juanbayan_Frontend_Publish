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
        acc_image: '',
        acc_totalpoints: 0,
        acc_role: null, // Adjust based on your Role type
        acc_acceptTerms: ''
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

    openModal(account?: Account) {
        if (account) {
            this.isEditing = true;
            this.currentAccount = { ...account }; // Copy the account for editing
        } else {
            this.isEditing = false;
            this.currentAccount = {
                id: '',
                acc_email: '',
                acc_passwordHash: '',
                acc_firstname: '',
                acc_lastname: '',
                acc_pnumber: '',
                acc_image: '',
                acc_totalpoints: 0,
                acc_role: null, 
                acc_acceptTerms: ''
            }; 
        }
        const modal = new bootstrap.Modal(document.getElementById('userAccountModal'));
        modal.show();
    }

    saveAccount() {
        if (this.isEditing) {
            this.accountService.update(this.currentAccount.id, this.currentAccount)
                .pipe(first())
                .subscribe(() => {
                    this.loadAccounts(); 
                });
        } else {
            this.accountService.create(this.currentAccount)
                .pipe(first())
                .subscribe(() => {
                    this.loadAccounts(); 
                });
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('userAccountModal'));
        modal.hide();
    }

    deleteAccount(id: string) {
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.accounts = this.accounts.filter(x => x.id !== id);
            });
    }

    onFileChange(event: any) {
        const file = event.target.files[0];
        // Handle the file (e.g., upload or display)
    }
}