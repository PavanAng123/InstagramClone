import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createposts',
  templateUrl: './createposts.component.html',
  styleUrls: ['./createposts.component.scss'],
})
export class CreatepostsComponent implements OnInit {
  createForm!: FormGroup;

  constructor(
    private authservice: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(500)]],
      images: this.fb.array([this.fb.control('', [Validators.required])]),
    });
  }

  get imageControls(): FormArray {
    return this.createForm.get('images') as FormArray;
  }

  addImage(): void {
    if (this.imageControls.length < 6) {
      this.imageControls.push(this.fb.control('', [Validators.required]));
    }
  }

  removeImage(index: number): void {
    if (this.imageControls.length > 1) {
      this.imageControls.removeAt(index);
    }
  }

  createposts(form: FormGroup) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const { title, content, images } = form.value;
    const postPayload = {
      title,
      content,
      imageurl: images,
    };

    this.authservice
      .savePostsInfo(
        postPayload.title,
        postPayload.content,
        postPayload.imageurl
      )
      .subscribe({
        next: (res) => {
          console.log('Post created successfully:', res);
          form.reset();
          // Reset images array to have at least one empty control after reset
          while (this.imageControls.length !== 1) {
            this.imageControls.removeAt(0);
          }
          this.imageControls.at(0).setValue('');
          alert('Post created successfully!');
          this.router.navigate(['/myaccount']);
        },
        error: (err) => {
          console.error('Failed to create post:', err);
          alert('Failed to create post. Please try again.');
        },
      });
  }
}
