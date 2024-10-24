import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllAuthorsComponent } from './all-authors.component';
import { AuthorService } from '../../../core/services/author.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthorDto } from '../../../shared/models/authorDto.model';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appIsAuthorized]'
})
export class MockIsAuthorizedDirective {
  @Input() appIsAuthorized: string[] = [];
}

describe('AllAuthorsComponent', () => {
  let component: AllAuthorsComponent;
  let fixture: ComponentFixture<AllAuthorsComponent>;
  let authorServiceMock: any;
  let navigationServiceMock: any;

  beforeEach(async () => {
    authorServiceMock = jasmine.createSpyObj('AuthorService', ['getAllAuthors', 'deleteAuthor']);
    navigationServiceMock = jasmine.createSpyObj('NavigationService', ['viewAuthor', 'updateAuthor']);

    await TestBed.configureTestingModule({
      declarations: [AllAuthorsComponent, MockIsAuthorizedDirective],
      imports: [FormsModule],
      providers: [
        { provide: AuthorService, useValue: authorServiceMock },
        { provide: NavigationService, useValue: navigationServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadAuthors on ngOnInit', () => {
    spyOn(component, 'loadAuthors');
    component.ngOnInit();
    expect(component.loadAuthors).toHaveBeenCalled();
  });

  it('should load authors on loadAuthors call', () => {
    const mockAuthors = {
      authors: [{ id: 1, name: 'Author 1' }, { id: 2, name: 'Author 2' }] as AuthorDto[],
      paginationMetadata: { totalCount: 2 }
    };
    authorServiceMock.getAllAuthors.and.returnValue(of(mockAuthors));

    component.loadAuthors();

    expect(authorServiceMock.getAllAuthors).toHaveBeenCalledWith(1, 10, '');
    expect(component.filteredAuthorsDto.length).toBe(2);
    expect(component.totalCount).toBe(2);
    console.log('Filtered Authors:', component.filteredAuthorsDto);
  });

  it('should handle error on loadAuthors when service fails', () => {
    authorServiceMock.getAllAuthors.and.returnValue(throwError(() => new Error('Error loading authors')));

    component.loadAuthors();

    expect(component.errorMessages.authors).toBe('Error loading authors');
    expect(component.loadingStates.authors).toBe(false);
    console.log('Error Messages:', component.errorMessages);
  });

  it('should delete author successfully', () => {
    component.authorIdToDelete = 2;
    authorServiceMock.deleteAuthor.and.returnValue(of({}));

    spyOn(component, 'loadAuthors');
    component.deleteAuthor();

    expect(authorServiceMock.deleteAuthor).toHaveBeenCalledWith(2);
    expect(component.successMessages.authors).toBe('Author deleted successfully!');
    expect(component.loadAuthors).toHaveBeenCalled();
    console.log('Success Messages:', component.successMessages);
  });

  it('should handle error on deleteAuthor when service fails', () => {
    component.authorIdToDelete = 2;
    authorServiceMock.deleteAuthor.and.returnValue(throwError(() => ({ message: 'Delete failed' })));

    component.deleteAuthor();

    expect(component.errorMessages.authors).toBe('Delete failed');
    expect(component.loadingStates.authors).toBe(false);
    console.log('Error Messages:', component.errorMessages);
  });

  it('should update search text on search', () => {
    component.searchTerm = 'test';
    const nextSpy = spyOn(component['searchText$'], 'next');
    component.search();
    expect(nextSpy).toHaveBeenCalledWith('test');
    console.log('Search Term:', component.searchTerm);
  });

  it('should call viewAuthor with correct id', () => {
    component.viewAuthor(1);
    expect(navigationServiceMock.viewAuthor).toHaveBeenCalledWith(1);
    console.log('Viewing Author with ID:', 1);
  });

  it('should call updateAuthor with correct id', () => {
    component.updateAuthor(1);
    expect(navigationServiceMock.updateAuthor).toHaveBeenCalledWith(1);
    console.log('Updating Author with ID:', 1);
  });

  it('should open author modal and set authorIdToDelete', () => {
    component.openAuthorModal(5);
    expect(component.authorIdToDelete).toBe(5);
    console.log('Author ID to Delete:', component.authorIdToDelete); 
  });

  it('should toggle sort direction and sort authors correctly', () => {
    component.filteredAuthorsDto = [
      { id: 1, name: 'Author B' },
      { id: 2, name: 'Author A' }
    ] as AuthorDto[];

    component.sortByName();
    expect(component.sortDirection).toBe('desc');
    expect(component.filteredAuthorsDto[0].name).toBe('Author B');

    component.sortByName();
    expect(component.sortDirection).toBe('asc');
    expect(component.filteredAuthorsDto[0].name).toBe('Author A');
    console.log('Sorted Authors:', component.filteredAuthorsDto);
  });

  it('should change page on onPageChange', () => {
    spyOn(component, 'loadAuthors');
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.loadAuthors).toHaveBeenCalled();
    console.log('Current Page:', component.currentPage);
  });
});
