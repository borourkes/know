import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

const Help = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Help</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="mb-4">
                Welcome to know | District - your advanced knowledge management platform.
                This platform helps you create, organize, and share internal knowledge
                while leveraging AI to make information easily accessible.
              </p>

              <h3 className="text-xl font-medium mb-2">Key Features</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Document creation and organization with rich text editing</li>
                <li>Category-based document management</li>
                <li>AI-powered document search and querying</li>
                <li>Role-based access control</li>
                <li>Dark mode support for comfortable viewing</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">User Roles & Permissions</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Admin</h3>
                  <ul className="list-disc pl-6">
                    <li>Full platform access</li>
                    <li>User management capabilities</li>
                    <li>Can create/edit/delete categories</li>
                    <li>Can create/edit/delete documents</li>
                    <li>Can assign user roles</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Editor</h3>
                  <ul className="list-disc pl-6">
                    <li>Can create/edit documents</li>
                    <li>Can create/edit categories</li>
                    <li>Can use AI features</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Reader</h3>
                  <ul className="list-disc pl-6">
                    <li>Can view documents</li>
                    <li>Can search documents</li>
                    <li>Can use AI assistant for queries</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Document Management</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Creating Documents</h3>
                  <ol className="list-decimal pl-6">
                    <li>Click the "New Document" button in the sidebar</li>
                    <li>Select a category for your document</li>
                    <li>Use the rich text editor to create your content</li>
                    <li>Click Save to store your document</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Managing Categories</h3>
                  <p>Categories help organize your documents. To create a new category:</p>
                  <ol className="list-decimal pl-6">
                    <li>Click "New Category" in the sidebar</li>
                    <li>Enter the category name</li>
                    <li>Click Create to add the category</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">AI Assistant</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p>
                  The AI Assistant helps you query your internal knowledge base effectively.
                  It only provides information that exists within your documents.
                </p>

                <div>
                  <h3 className="text-lg font-medium mb-2">Using the AI Assistant</h3>
                  <ol className="list-decimal pl-6">
                    <li>Click the "AI Assistant" button in the sidebar</li>
                    <li>Type your question in the chat input</li>
                    <li>The AI will search through your documents and provide relevant information</li>
                    <li>If no relevant information exists, the AI will inform you</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">How do I change my password?</h3>
                    <p>Contact your administrator to reset your password.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Can I export documents?</h3>
                    <p>Currently, documents can be copied directly from the editor.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">How does the AI Assistant work?</h3>
                    <p>
                      The AI Assistant searches through your internal documents to find relevant
                      information and provides answers based solely on your organization's knowledge base.
                      It will not provide information from external sources.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">How do I switch between light and dark mode?</h3>
                    <p>
                      Click the theme toggle button in the sidebar footer to switch between light,
                      dark, or system theme.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">How do I organize my documents?</h3>
                    <p>
                      Use categories to group related documents. You can create new categories
                      and move documents between them as needed.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">What happens if I can't find a document?</h3>
                    <p>
                      Use the search function in the sidebar or ask the AI Assistant to help
                      locate specific information within your documents.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Help;