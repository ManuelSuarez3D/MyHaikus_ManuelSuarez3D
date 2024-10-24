import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subject, BehaviorSubject, debounceTime, distinctUntilChanged, switchMap, takeUntil, finalize } from "rxjs";
import { AuthorService } from "../../../../core/services/author.service";
import { SyllableValidator } from "../../../../core/utilities/syllable-validator";
import { AuthorDto } from "../../../../shared/models/authorDto.model";
import { AuthorHaikuDto } from "../../../../shared/models/authorHaikuDto.model";

@Component({
  selector: 'app-update-author-haiku-form',
  templateUrl: './update-author-haiku-form.component.html',
  styleUrls: ['./update-author-haiku-form.component.css']
})
export class UpdateAuthorHaikuFormComponent implements OnInit, OnDestroy {
  updateAuthorHaikuForm: FormGroup;
  private unsubscribe$ = new Subject<void>();
  private searchText$ = new BehaviorSubject<string>('');
  private readonly defaultTitle = "Untitled";
  initialFormValues: any = {};

  @Input() authorHaikuDto: AuthorHaikuDto = { id: 0, title: '', lineOne: '', lineTwo: '', lineThree: '', authorId: 0 };
  @Output() formSubmit = new EventEmitter<AuthorHaikuDto>();

  isSubmitted: boolean = false;
  hasMoreAuthors = false;
  searchTerm: string = '';

  errorMessages: { authors: string | null } = {
    authors: null,
  };

  loadingStates = {
    authors: false,
  };

  authorsDto: AuthorDto[] = [];
  authorAuthorHaikusDto: AuthorHaikuDto[] = [];
  filteredAuthorsDto: AuthorDto[] = [];

  currentPage: number = 1;
  pageSize: number = 20;
  totalCount: number = 0;
  totalPages: number = 0;

  constructor(private fb: FormBuilder, private authorService: AuthorService) {
    this.updateAuthorHaikuForm = this.fb.group({
      id: [null],
      name: [''],
      title: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      lineOne: ['', [Validators.required, SyllableValidator.syllableCountValidator(5)]],
      lineTwo: ['', [Validators.required, SyllableValidator.syllableCountValidator(7)]],
      lineThree: ['', [Validators.required, SyllableValidator.syllableCountValidator(5)]],
      authorId: [null, [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadingStates.authors = true;
    this.clearMessages();

    this.loadAuthorById(this.authorHaikuDto.authorId);
    this.loadAuthors();
    this.patchForm();
  }

  ngOnChanges(): void {
    this.patchForm();
  }

  /**
   * Stores the initial values of the user update form fields.
   * This method captures the initial title, lines and authorId for comparison later.
   * @returns {void} This method does not return a value.
  */
  private storeInitialFormValues(): void {
    this.initialFormValues = {
      title: this.updateAuthorHaikuForm.get('title')?.value,
      lineOne: this.updateAuthorHaikuForm.get('lineOne')?.value,
      lineTwo: this.updateAuthorHaikuForm.get('lineTwo')?.value,
      lineThree: this.updateAuthorHaikuForm.get('lineThree')?.value,
      authorId: this.updateAuthorHaikuForm.get('authorId')?.value
    };
  }

  /**
   * Checks if changes were made to the user form compared to the initial values.
   * This method compares the current values of the title, lines and authorId fields
   * with the initial values stored on form initialization.
   * @returns {boolean} Returns true if changes were made, otherwise false.
  */
  changesMade(): boolean {
    const currentFormValues = {
      title: this.updateAuthorHaikuForm.get('title')?.value,
      lineOne: this.updateAuthorHaikuForm.get('lineOne')?.value,
      lineTwo: this.updateAuthorHaikuForm.get('lineTwo')?.value,
      lineThree: this.updateAuthorHaikuForm.get('lineThree')?.value,
      authorId: this.updateAuthorHaikuForm.get('authorId')?.value
    };

    return JSON.stringify(this.initialFormValues) !== JSON.stringify(currentFormValues);
  }

  /**
   * Clears any error messages related to author loading.
   * @returns {void} This method does not return a value.
  */
  private clearMessages(): void {
    this.errorMessages = {
      authors: null,
    };
  }

  /**
   * Handles errors for specific types of operations (e.g., author loading) and updates loading states.
   * 
   * @param {any} error - The error response or message.
   * @param {'authors'} type - The type of operation encountering the error.
   * @returns {void} This method does not return a value.
  */
  private handleError(error: any, type: 'authors'): void {
    this.loadingStates[type] = false;
    this.errorMessages[type] = error.message || 'An unknown error occurred, please try again later.';
  }

  /**
   * Loads a paginated list of authors based on the search term.
   * This method uses RxJS operators to handle debounce, switchMap, and loading states.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthors(): void {
    this.loadingStates.authors = true;
    this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        return this.authorService.getAllAuthors(this.currentPage, this.pageSize, searchTerm).pipe(
          takeUntil(this.unsubscribe$),
          finalize(() => this.loadingStates.authors = false)
        );
      })
    ).subscribe({
      next: ({ authors, paginationMetadata }) => {
        this.authorsDto = authors;
        this.totalCount = paginationMetadata.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
        this.hasMoreAuthors = this.totalPages > this.currentPage;
        this.updateFilteredAuthors();
      },
      error: error => this.handleError(error, 'authors')
    });
  }

  /**
   * Loads an author's details by their ID and patches the form with the author's name.
   * 
   * @param {number} authorId - The ID of the author to load.
   * @returns {void} This method does not return a value.
   * @throws Will call `handleError` with an error message on failure.
  */
  loadAuthorById(authorId: number): void {
    this.loadingStates.authors = true;

    this.authorService.getAuthorById(authorId).pipe(
      takeUntil(this.unsubscribe$),
      finalize(() => {
        this.loadingStates.authors = false;
      })
    ).subscribe({
      next: author => {
        this.updateAuthorHaikuForm.patchValue({ name: author.name });
      },
      error: error => this.handleError(error, 'authors')
    });
  }

  /**
   * Handles the user input event for searching authors. It updates the `searchText$` BehaviorSubject with the current value.
   * 
   * @param {Event} event - The input event from the search field.
   * @returns {void} This method does not return a value.
  */
  searchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    this.searchText$.next(inputValue);
  }

  /**
   * Filters the list of authors based on the current search term.
   * @returns {void} This method does not return a value.
  */
  updateFilteredAuthors(): void {
    this.filteredAuthorsDto = this.authorsDto.filter(author =>
      author.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /**
   * Selects an author from the filtered authors list and patches the form with the selected author's name and ID.
   * 
   * @param {AuthorDto} authorDto - The selected author DTO object.
   * @returns {void} This method does not return a value.
  */
  selectAuthor(authorDto: AuthorDto): void {
    this.updateAuthorHaikuForm.patchValue({ name: authorDto.name, authorId: authorDto.id });
  }

  /**
   * Patches the form with the values from the `authorDto` object if it exists.
   * This method updates the form controls with the author's original content and stores the initial values.
   * @returns {void} This method does not return a value.
  */
  private patchForm(): void {
    if (this.authorHaikuDto) {
      this.updateAuthorHaikuForm.patchValue({
        id: this.authorHaikuDto.id,
        title: this.authorHaikuDto.title,
        lineOne: this.authorHaikuDto.lineOne,
        lineTwo: this.authorHaikuDto.lineTwo,
        lineThree: this.authorHaikuDto.lineThree,
        authorId: this.authorHaikuDto.authorId,
      });
      this.storeInitialFormValues();
    }
  }

  /**
   * Submits the form and emits the form data as an `AuthorHaikuDto` if the form is valid.
   * If the title is not provided, it defaults to 'Untitled'.
   * Verifies that changes were made.
   * @returns {void} This method does not return a value.
  */
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.updateAuthorHaikuForm.valid && this.changesMade()) {
      const authorHaikuDto: AuthorHaikuDto = {
        ...this.updateAuthorHaikuForm.value,
        title: this.updateAuthorHaikuForm.value.title || this.defaultTitle,
      };
      this.formSubmit.emit(authorHaikuDto);
      this.resetForm();
    }
  }

  /**
   * Resets the form and clears the submission state.
   * @returns {void} This method does not return a value.
  */
  resetForm(): void {
    this.isSubmitted = false;
    this.updateAuthorHaikuForm.reset();
  }

  /**
   * Checks whether a form control has a specific error or is invalid.
   * 
   * @param {string} controlName - The name of the form control.
   * @param {string} [errorType] - The specific error type to check for.
   * @returns {boolean} - Returns true if the control is invalid and the error matches, or if no specific error type is provided.
  */
  hasError(controlName: string, errorType?: string): boolean {
    const control = this.updateAuthorHaikuForm.get(controlName);
    if (!control) {
      return false;
    }
    return this.isSubmitted && control.invalid && (errorType ? control.hasError(errorType) : true);
  }
}
