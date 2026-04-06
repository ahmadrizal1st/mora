import { useEffect } from 'react';
import hugeRTE from 'hugerte';
import BaseLayout from '../layouts/BaseLayout';

export default function WysiwygPage() {
  const id = 'mytextarea';

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-bs-theme');
    
    const options: any = {
      selector: `#hugerte-${id}`,
      base_url: '/tabler/libs/hugerte',
      suffix: '.min',
      height: 300,
      menubar: false,
      statusbar: false,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
        'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat',
      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; -webkit-font-smoothing: antialiased; }'
    };

    if (theme === 'dark') {
      options.skin = 'oxide-dark';
      options.content_css = 'dark';
    }

    hugeRTE.init(options);

    return () => {
      // Cleanup
      (window as any).hugeRTE?.get(`hugerte-${id}`)?.remove();
    };
  }, []);

  return (
    <BaseLayout pageTitle="HugeRTE">
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Your name</label>
            <input type="text" className="form-control" name="example-text-input" placeholder="Name" />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <form method="post">
              <textarea id={`hugerte-${id}`} defaultValue="Hello, <b>Tabler</b>!"></textarea>
            </form>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
