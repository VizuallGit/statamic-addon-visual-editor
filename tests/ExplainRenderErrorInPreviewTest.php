<?php

namespace MarioHamann\StatamicVisualEditor\Tests;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use MarioHamann\StatamicVisualEditor\Http\Middleware\ExplainRenderErrorInPreview;
use MarioHamann\StatamicVisualEditor\Http\Middleware\ExplainRenderErrorInPreview\Words;
use Statamic\Modifiers\ModifierNotFoundException;
use Statamic\View\Antlers\Language\Exceptions\SyntaxErrorException;
use Throwable;

class ExplainRenderErrorInPreviewTest extends TestCase
{
    protected function middleware(bool $livePreview): ExplainRenderErrorInPreview
    {
        return new class($livePreview) extends ExplainRenderErrorInPreview
        {
            public function __construct(private bool $livePreview)
            {
            }

            protected function isLivePreview(Request $request): bool
            {
                return $this->livePreview;
            }
        };
    }

    protected function failing(Throwable $e): Response
    {
        return (new Response('<html><body>sixty vendor frames</body></html>', 500))->withException($e);
    }

    protected function through(ExplainRenderErrorInPreview $middleware, Response $response): Response
    {
        return $middleware->handle(Request::create('/test'), fn () => $response);
    }

    protected function syntaxError(string $message, string $tag, int $line = 7): SyntaxErrorException
    {
        $e = new SyntaxErrorException($message);
        $e->node = (object) ['content' => $tag, 'startPosition' => (object) ['line' => $line]];

        return $e;
    }

    public function test_a_word_antlers_takes_for_a_modifier_is_explained_in_words()
    {
        $response = $this->through($this->middleware(true), $this->failing(new ModifierNotFoundException('in')));
        $html = (string) $response->getContent();

        $this->assertSame(500, $response->getStatusCode());
        $this->assertStringContainsString('The template cannot be shown', $html);
        $this->assertStringContainsString('“in” is not something Antlers knows', $html);
        $this->assertStringContainsString('Open the template in the dock', $html);
        $this->assertStringContainsString('<details>', $html);
        $this->assertStringContainsString(ModifierNotFoundException::class, $html);
        $this->assertStringNotContainsString('sixty vendor frames', $html);
    }

    public function test_antlers_syntax_errors_name_the_tag_and_the_line()
    {
        $words = Words::explain($this->syntaxError('Unclosed "if" control structure.', ' if title ', 12));

        $this->assertSame('{{ if }} is missing its {{ /if }}', $words['reason']);
        $this->assertSame('In {{ if title }} on line 12', $words['where']);

        $words = Words::explain($this->syntaxError('Unpaired closing tag.', ' /if '));

        $this->assertSame('{{ /if }} closes something that was never opened', $words['reason']);

        $words = Words::explain($this->syntaxError('Unexpected end of input while parsing Antlers region.', ''));

        $this->assertSame('A {{ is missing its }}', $words['reason']);
        $this->assertSame('', $words['where']);
    }

    public function test_anything_else_keeps_statamics_own_message()
    {
        $words = Words::explain(new \RuntimeException('Call to undefined method foo()'));

        $this->assertSame('Statamic says: Call to undefined method foo()', $words['reason']);
        $this->assertSame('The template cannot be shown', $words['title']);
    }

    public function test_the_page_escapes_what_the_template_wrote()
    {
        $html = Words::html($this->syntaxError('Unpaired closing tag.', ' /if <script>alert(1)</script> '));

        $this->assertStringNotContainsString('<script>alert(1)</script>', $html);
        $this->assertStringContainsString('&lt;script&gt;', $html);
    }

    public function test_outside_live_preview_and_without_an_exception_nothing_changes()
    {
        $public = $this->through($this->middleware(false), $this->failing(new ModifierNotFoundException('in')));

        $this->assertStringContainsString('sixty vendor frames', (string) $public->getContent());

        $fine = new Response('<html><body>the page</body></html>', 200);
        $untouched = $this->through($this->middleware(true), $fine);

        $this->assertSame('<html><body>the page</body></html>', (string) $untouched->getContent());
        $this->assertSame(200, $untouched->getStatusCode());
    }
}
